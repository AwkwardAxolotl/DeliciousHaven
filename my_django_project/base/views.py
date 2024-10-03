from datetime import datetime, timedelta
import os
from my_django_project.settings import cloudinary
from rest_framework.decorators import api_view
import random
import string
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .utils import (
    connect_to_database,
    get_recipes_by_category,
    distinct_categories,
    get_random_recipes,
    get_recipes_by_ingredients,
    get_recipes_by_category_and_ingredient,
    get_recipe,
    get_user,
    get_favs_from_user,
    get_all_recipes_from_db,
)
from django.core.mail import send_mail
from django.core.validators import validate_email
import re
import bcrypt

db, client = connect_to_database()


def generate_otp():
    return "".join(random.choices(string.digits, k=6))


@csrf_exempt
@api_view(["POST"])
def signUp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            if db.count_documents({"username": data["username"]}) != 0:
                return JsonResponse(
                    {"error": "Username already exists!!", "success": False}, status=400
                )
            if db.count_documents({"email": data["email"]}) != 0:
                return JsonResponse(
                    {"error": "Email already registered with us!!!", "success": False},
                    status=400,
                )
            username = data["username"]
            email = data["email"]
            try:
                validate_email(email)
            except:
                return JsonResponse(
                    {"error": "Invalid email!!", "success": False}, status=400
                )
            password = data["password"]
            enc_pass = password.encode("utf-8")
            salt = bcrypt.gensalt()
            hashed_pw = bcrypt.hashpw(enc_pass, salt)

            db.insert_one(
                {
                    "username": username,
                    "email": email,
                    "password": hashed_pw.decode("utf-8"),
                    "first_name": "",
                    "last_name": "",
                    "phone_no": "",
                    "profile_pic": "/img/profile_icon.png",
                    "favourites":{},
                    "notifications":{},
                }
            )
            response_data = {"message": "User created successfully!!", "success": True}
            return JsonResponse(response_data, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON", "success": False}, status=400)
    return JsonResponse(
        {"error": "Invalid request method", "success": False}, status=405
    )


@csrf_exempt
@api_view(["POST"])
def signIn(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if db.count_documents({"username": data["username"]}) == 0:
            return JsonResponse(
                {"error": "User does not exist!!", "success": False}, status=400
            )
        user = db.find_one({"username": data["username"]})
        username = user.get("username")
        password = user.get("password")
        if isinstance(password, str):
            password = password.encode("utf-8")
        if bcrypt.checkpw(data["password"].encode("utf-8"), password):
            return JsonResponse(
                {"message": f"Welcome {username}", "success": True}, status=200
            )
        return JsonResponse(
            {"error": "Invalid login credentails!!", "success": False}, status=400
        )


@csrf_exempt
@api_view(["POST"])
def googleSignInUp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        email = data["email"]

        if db.count_documents({"email": email}) != 0:
            user_details = db.find_one({"username": username, "email": email})
            try:
                if bcrypt.checkpw(
                    password.encode("utf-8"), user_details["password"].encode("utf-8")
                ):
                    return JsonResponse(
                        {
                            "message": f"Welcome {username}",
                            "username": username,
                            "success": True,
                        },
                        status=200,
                    )
            except:
                return JsonResponse(
                    {"error": "Invalid login credentails!!", "success": False},
                    status=400,
                )
            return JsonResponse(
                {"error": "Invalid login credentails!!", "success": False}, status=400
            )

        enc_pass = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(enc_pass, salt)

        db.insert_one(
            {
                "username": username,
                "email": email,
                "password": hashed_pw.decode("utf-8"),
            }
        )
        response_data = {
            "message": "User created successfully!!",
            "success": True,
            "username": username,
        }
        return JsonResponse(response_data, status=200)


@csrf_exempt
@api_view(["POST"])
def forgotPassword(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data["email"]
        try:
            validate_email(email)
        except:
            return JsonResponse(
                {"error": "Invalid email!!", "success": False}, status=400
            )
        if db.count_documents({"email": email}) == 0:
            return JsonResponse(
                {"error": "Email not registered!!", "success": False}, status=400
            )
        else:
            username = db.find_one({"email": email})["username"]
            otp = generate_otp()
            otp_db = client["Test_project"]["otp_database"]
            timestamp = datetime.now()
            otp_db.insert_one(
                {
                    "username": username,
                    "email": email,
                    "otp": otp,
                    "timestamp": timestamp,
                }
            )
            send_mail(
                subject="Your OTP Code",
                message=f"Hello, your OTP code is {otp}. It is valid for 3 minutes.",
                from_email="krashmeh@gmail.com",
                recipient_list=[email],
            )

            return JsonResponse(
                {"Success": "Email sent successfully!!", "success": True}, status=200
            )


@csrf_exempt
@api_view(["POST"])
def validateUser(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data["username"]
            user_exists = db.count_documents({"username": username}) > 0
            if user_exists:
                return JsonResponse({"success": True}, status=200)
            else:
                return JsonResponse({"success": False}, status=404)
        except Exception as e:
            return JsonResponse(
                {"error": "Invalid username", "success": False}, status=400
            )


@csrf_exempt
@api_view(["POST"])
def sendNewsletterEmail(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data["email"]

        try:
            validate_email(email)
        except:
            return JsonResponse(
                {"error": "Invalid email!!", "success": False}, status=400
            )

        if db.count_documents({"email": email}) == 0:
            return JsonResponse(
                {"error": "Email not registered!!", "success": False}, status=400
            )
        else:
            try:
                # Sending the email
                send_mail(
                    subject="Subscription to Delicious Food Blog",
                    message="Thank you for subscribing to the Delicious Food Blog newsletter! Stay tuned for amazing recipes and cooking tips.",
                    from_email="your_email@example.com",
                    recipient_list=[email],
                    fail_silently=False,
                )
                return JsonResponse(
                    {
                        "message": "Subscription email sent successfully!",
                        "success": True,
                    },
                    status=200,
                )
            except Exception as e:
                return JsonResponse({"error": str(e), "success": False}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
@api_view(["POST"])
def valOTP(request):
    if request.method == "POST":
        data = json.loads(request.body)
        otp = str(data["otp"])
        otp_db = client["Test_project"]["otp_database"]
        user_otp = otp_db.find_one({"otp": otp})

        if not user_otp:
            return JsonResponse(
                {"error": "Invalid OTP!!!", "success": False}, status=400
            )

        timestamp = user_otp["timestamp"]
        if datetime.now() - timestamp > timedelta(minutes=3):
            return JsonResponse(
                {"error": "OTP expired!!!", "success": False}, status=400
            )
        otp_db.delete_one({"otp": otp})
        return JsonResponse(
            {
                "message": "OTP verified successfully!!",
                "username": user_otp["username"],
                "success": True,
            },
            status=200,
        )


@csrf_exempt
@api_view(["POST"])
def send_contact_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data["name"]
            email = data["email"]
            subject = data["subject"]
            message = data["message"]

            if db.count_documents({"email": email}) == 0:
                return JsonResponse(
                    {"error": "Email not registered!!", "success": False}, status=400
                )
            # Compose email
            email_subject = f"New Contact Form Submission: {subject}"
            email_message = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"

            # Send email
            send_mail(
                email_subject,
                email_message,
                "krashmeh@gmail.com",
                ["22002170110073@ljku.edu.in"],
            )

            return JsonResponse(
                {"success": True, "message": "Email sent successfully!!!"}, status=200
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
    return JsonResponse(
        {"success": False, "error": "Invalid request method"}, status=400
    )


@csrf_exempt
@api_view(["POST"])
def getBlogs(request):
    if request.method == "POST":
        data = json.loads(request.body)
        filter_blog = data["filter"]
        blog = client["Test_project"]["blogs"]
        categories = blog.distinct("category")

        if not filter_blog:
            blogs = list(
                blog.find(
                    {},
                    {
                        "_id": 0,
                        "pub_date": 1,
                        "author": 1,
                        "title": 1,
                        "paragraphs": 1,
                        "category": 1,
                        "image": 1,
                    },
                )
            )
            dates = set()
            for b in blogs:
                date_parts = b["pub_date"].split(",")
                month, day = date_parts[0].split()
                year = date_parts[1].strip()

                day = day.zfill(2)

                b["pub_date"] = {"month": month, "date": day, "year": year}
                dates.add(f"{month} {year}")
            return JsonResponse(
                {
                    "success": True,
                    "blogs": blogs,
                    "categories": categories,
                    "dates": list(dates),
                },
                status=200,
            )
        if not filter_blog.split()[-1].isdigit():
            blogs = list(
                blog.find(
                    {"category": filter_blog},
                    {
                        "_id": 0,
                        "pub_date": 1,
                        "author": 1,
                        "title": 1,
                        "paragraphs": 1,
                        "category": 1,
                        "image": 1,
                    },
                )
            )
        else:
            date_filter = {}
            if filter_blog:
                month_year = filter_blog.split()
                month = month_year[0]
                year = month_year[1]
                date_filter = {"pub_date": {"$regex": f"^{month} \d{{1,2}}, {year}$"}}
                blogs = list(
                    blog.find(
                        date_filter,
                        {
                            "_id": 0,
                            "pub_date": 1,
                            "author": 1,
                            "title": 1,
                            "paragraphs": 1,
                            "category": 1,
                            "image": 1,
                        },
                    )
                )

        for b in blogs:
            date_parts = b["pub_date"].split(",")
            month, day = date_parts[0].split()
            year = date_parts[1].strip()

            day = day.zfill(2)

            b["pub_date"] = {"month": month, "date": day, "year": year}

        return JsonResponse(
            {"success": True, "blogs": blogs, "categories": categories}, status=200
        )


@csrf_exempt
@api_view(["POST"])
def getSingleBlog(request):
    if request.method == "POST":
        data = json.loads(request.body)
        title = data["title"]
        blog = client["Test_project"]["blogs"]
        single_blog = blog.find_one(
            {"title": title},
            {
                "_id": 0,
                "pub_date": 1,
                "author": 1,
                "title": 1,
                "paragraphs": 1,
                "category": 1,
                "image": 1,
                "comments": 1,
            },
        )

        if single_blog:
            side_blogs = blog.aggregate(
                [
                    {"$sample": {"size": 3}},
                    {
                        "$project": {
                            "_id": 0,
                            "pub_date": 1,
                            "author": 1,
                            "title": 1,
                            "image": 1,
                        }
                    },
                ]
            )
            return JsonResponse(
                {"success": True, "blog": single_blog, "side_blogs": list(side_blogs)},
                status=200,
            )
        else:
            return JsonResponse({"success": False, "error": title}, status=404)


@csrf_exempt
@api_view(["POST"])
def addComment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data["username"]
            title = data["title"]
            time = data["time"]
            comment = data["comment"]
            recipe = data["recipe"]
            userRecipe = data["userRecipe"]
            if userRecipe:
                user_recipe_name = data["user"]
                user = get_user(user_recipe_name)
                notifs = user["notifications"]
                if notifs:
                    if notifs.get(time, ""):
                        notifs[time].append(f"{username} has commented on your recipe {title}!!!!")
                    else:
                        notifs[time] = [
                            f"{username} has commented on your recipe {title}!!!!",
                        ]
                else:
                    notifs[time] = [
                        f"{username} has commented on your recipe {title}!!!!",
                    ]
                db.update_one(
                    {"username": user_recipe_name}, {"$set": {"notifications": notifs}}
                )
            if recipe:
                recipe = client["Test_project"]["recipes"]
                comments = list(recipe.find_one({"title": title})["comments"])
                comments.append(
                    {
                        "username": username,
                        "title": title,
                        "time": time,
                        "comment": comment,
                    }
                )
                recipe.update_one({"title": title}, {"$set": {"comments": comments}})
                return JsonResponse(
                    {"success": True, "message": "Comment added successfully!!!"},
                    status=200,
                )

            blog = client["Test_project"]["blogs"]

            comments = list(blog.find_one({"title": title})["comments"])
            comments.append(
                {"username": username, "title": title, "time": time, "comment": comment}
            )
            blog.update_one({"title": title}, {"$set": {"comments": comments}})
            return JsonResponse(
                {"success": True, "message": "Comment added successfully!!!"},
                status=200,
            )
        except Exception as e:
            return JsonResponse(
                {"success": False, "error": "Unknown error occured!!!!"}, status=404
            )


@csrf_exempt
@api_view(["POST"])
def updateUserDetails(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        first_name = data["firstName"]
        last_name = data["lastName"]
        email = data["email"]
        phone = data["phone"]
        oldPassword = data["oldPassword"]
        newPassword = data["newPassword"]
        if isinstance(oldPassword, str):
            oldPassword = oldPassword.encode("utf-8")
        user_entry = db.find_one({"username": username})
        password = user_entry["password"]
        if isinstance(password, str):
            password = password.encode("utf-8")
        if oldPassword and newPassword:
            if bcrypt.checkpw(oldPassword, password):
                db.update_one(
                    {"username": username},
                    {
                        "$set": {
                            "password": bcrypt.hashpw(
                                newPassword.encode("utf-8"), bcrypt.gensalt()
                            ),
                            "first_name": first_name,
                            "last_name": last_name,
                            "phone_no": phone,
                            "email": email,
                        }
                    },
                )

                return JsonResponse(
                    {"success": True, "message": "Updated successfully!!!"},
                    status=200,
                )
            return JsonResponse(
                {"success": False, "error": "Incorrect password!!!"},
                status=400,
            )
        else:
            try:
                validate_email(email)
            except:
                return JsonResponse(
                    {"error": "Invalid email!!", "success": False}, status=400
                )

            if len(phone) != 10 or not phone.isdigit():
                return JsonResponse(
                    {"error": "Invalid phone number!!", "success": False},
                    status=400,
                )

            db.update_one(
                {"username": username},
                {
                    "$set": {
                        "first_name": first_name,
                        "last_name": last_name,
                        "phone_no": phone,
                        "email": email,
                    }
                },
            )
            return JsonResponse(
                {"message": "Updated successfully!!", "success": True},
                status=200,
            )


@csrf_exempt
@api_view(["POST"])
def getUserDetails(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username", "")
            encUsername = data.get("encUsername", "")
            user_entry = db.find_one({"username": username})
            recipes = client["Test_project"]["recipes"]
            user_recipes = recipes.find({"username": encUsername}, {"_id": 0})
            if user_recipes:
                user_recipes = list(user_recipes)
            else:
                user_recipes = []
            if user_entry:
                return JsonResponse(
                    {
                        "message": "Fetched successfully!!",
                        "success": True,
                        "username": user_entry["username"],
                        "firstName": user_entry.get("first_name", ""),
                        "lastName": user_entry.get("last_name", ""),
                        "phone": user_entry.get("phone_no", ""),
                        "email": user_entry.get("email", ""),
                        "image": user_entry.get("profile_pic", ""),
                        "favourites": user_entry.get("favourites", ""),
                        "user_recipes": user_recipes,
                        "notifications": user_entry.get("notifications", ""),
                    },
                    status=200,
                )
            else:
                return JsonResponse(
                    {"message": "User not found", "success": False}, status=404
                )
        except Exception as e:
            return JsonResponse({"message": str(e), "success": False}, status=500)


# @csrf_exempt
# @api_view(["POST"])
# def uploadProfileImage(request):
#     if request.method == "POST":
#         EXTERNAL_IMAGE_DIR = "C:/Users/OM/Desktop/DeliciousHaven/DeliciousHaven/my-project/public/profile_pics"
#         username = request.POST.get("username")
#         image = request.FILES.get("image")

#         if not username or not image:
#             return JsonResponse(
#                 {"error": "Username or image file is missing."}, status=400
#             )

#         # Ensure the external directory exists
#         if not os.path.exists(EXTERNAL_IMAGE_DIR):
#             os.makedirs(EXTERNAL_IMAGE_DIR)

#         # Define the file path
#         file_path = os.path.join(EXTERNAL_IMAGE_DIR, f"{username}.jpg")

#         # Create FileSystemStorage object with overwrite capability
#         fs = FileSystemStorage(location=EXTERNAL_IMAGE_DIR)

#         # Check if the file already exists and overwrite it
#         if fs.exists(f"{username}.jpg"):
#             fs.delete(f"{username}.jpg")

#         fs.save(f"{username}.jpg", image)

#         # Get the relative path to store in the database
#         relative_file_path = os.path.join("/profile_pics", f"{username}.jpg").replace(
#             "\\", "/"
#         )

#         # Update the user's profile_pic field in MongoDB
#         db.update_one(
#             {"username": username}, {"$set": {"profile_pic": relative_file_path}}
#         )

#         return JsonResponse({"success": True, "file_path": relative_file_path})

#     return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
@api_view(["POST"])
def uploadProfileImage(request):
    if request.method == "POST":
        username = request.POST.get("username")
        image = request.FILES.get("image")

        if not username or not image:
            return JsonResponse(
                {"error": "Username or image file is missing."}, status=400
            )

        # Upload the image to Cloudinary
        try:
            upload_result = cloudinary.uploader.upload(image, folder=f"profile_pics/{username}")
            file_url = upload_result['secure_url']
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        # Update MongoDB with the image URL
        db.update_one({"username": username}, {"$set": {"profile_pic": file_url}})

        return JsonResponse({"success": True, "file_path": file_url})

    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
@api_view(["POST"])
def getRecipes(request):
    if request.method == "POST":
        data = json.loads(request.body)
        category = data.get("category", "")
        ingredients = data.get("ingredients", "")

        if ingredients:
            # Validate the ingredients pattern
            pattern = r"^[a-zA-Z\s]+(,[a-zA-Z\s]+)*$"
            if not re.match(pattern, ingredients):
                return JsonResponse(
                    {
                        "error": "Ingredients must be separated by commas and contain only letters and spaces!",
                        "success": False,
                    },
                    status=400,
                )
            ingredients = ingredients.split(",")

        try:
            if category and not ingredients:
                recipes = get_recipes_by_category(category)
                return JsonResponse(
                    {
                        "message": "Fetched Successfully!!",
                        "success": True,
                        "recipes": recipes,
                    },
                    status=200,
                )
            elif ingredients and not category:
                recipes_ingredients = get_recipes_by_ingredients(ingredients)
                if recipes_ingredients:
                    return JsonResponse(
                        {
                            "message": "Fetched Successfully!!",
                            "success": True,
                            "recipes": recipes_ingredients,
                        },
                        status=200,
                    )
                return JsonResponse(
                    {
                        "error": "No recipes with such ingredients!!!",
                        "success": False,
                    },
                    status=400,
                )
            elif category and ingredients:
                recipes_cat_ingre = get_recipes_by_category_and_ingredient(
                    category, ingredients
                )
                if recipes_cat_ingre:
                    return JsonResponse(
                        {
                            "message": "Fetched Successfully!!",
                            "success": True,
                            "recipes": recipes_cat_ingre,
                        },
                        status=200,
                    )
                return JsonResponse(
                    {
                        "error": "No recipes with such ingredients and category!!!",
                        "success": False,
                    },
                    status=400,
                )
            elif not category and not ingredients:
                categories = distinct_categories()
                recipes = get_random_recipes(20)
                return JsonResponse(
                    {
                        "message": "Categories fetched Successfully!!",
                        "success": True,
                        "categories": categories,
                        "recipes": list(recipes),
                    },
                    status=200,
                )
            else:
                return JsonResponse(
                    {
                        "error": "An unexpected error occurred.",
                        "success": False,
                    },
                    status=400,
                )
        except Exception as e:
            return JsonResponse(
                {
                    "error": str(e),
                    "success": False,
                },
                status=500,
            )


@csrf_exempt
@api_view(["POST"])
def get_single_recipe(request):
    if request.method == "POST":
        data = json.loads(request.body)
        title = data["title"]
        username = data["username"]
        user_favs = get_user(username)["favourites"]
        user_recipe = False
        recipe = get_recipe(title)
        if recipe.get("username", ""):
            user_recipe = True
        random_recipes = get_random_recipes(4)
        fav = False
        if user_favs:
            recipe_favs_name = []
            for category in user_favs.values():
                for recipes in category:
                    recipe_favs_name.append(recipes["title"])
        else:
            recipe_favs_name = []
        if recipe:
            if recipe["title"] in recipe_favs_name:
                fav = True
            return JsonResponse(
                {
                    "message": "Recipe fetched Successfully!!",
                    "success": True,
                    "recipe": recipe,
                    "randomRecipes": list(random_recipes),
                    "fav": fav,
                    "user_recipe": user_recipe,
                },
                status=200,
            )
        else:
            return JsonResponse(
                {
                    "error": "No recipe of this name!!!",
                    "success": False,
                },
                status=400,
            )


@csrf_exempt
@api_view(["POST"])
def add_ratings(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data["title"]
            rating = data["rating"]
            recipe_db = client["Test_project"]["recipes"]
            username = data["username"]
            userRecipe = data["userRecipe"]
            recipe = get_recipe(title)
            recipe_rating = recipe.get("rating", "")
            user_ratings = recipe.get("reviews", "")
            user_ratings[username] = rating
            if userRecipe:
                user_recipe_name = data["user"]
                user = get_user(user_recipe_name)
                notifs = user["notifications"]
                time = datetime.today().strftime("%B %d, %Y")
                if notifs:
                    if notifs[time]:
                        notifs[time].append(
                            f"{username} has rated your recipe {title} {rating}/5!!!!"
                        )
                    else:
                        notifs[time] = [
                            f"{username} has rated your recipe {title} {rating}/5!!!!",
                        ]
                else:
                    notifs[time] = [
                        f"{username} has rated your recipe {title} {rating}/5!!!!",
                    ]
                db.update_one(
                    {"username": user_recipe_name}, {"$set": {"notifications": notifs}}
                )

            if recipe_rating == "No rating given!!!":
                recipe_db.update_one(
                    {"title": title},
                    {
                        "$set": {
                            "rating": rating,
                            "total_reviews": 1,
                            "reviews": user_ratings,
                        }
                    },
                )
                return JsonResponse(
                    {
                        "message": "Rated successfully!!!",
                        "success": True,
                        "rating": rating,
                        "total_reviews": 1,
                    },
                    status=200,
                )
            else:
                total_reviews = int(recipe.get("total_reviews", ""))
                new_total_reviews = total_reviews + 1
                new_ratings = ((recipe_rating * total_reviews) + rating) / (
                    new_total_reviews
                )
                new_ratings = round(number=new_ratings, ndigits=2)
                recipe_db.update_one(
                    {"title": title},
                    {
                        "$set": {
                            "rating": new_ratings,
                            "total_reviews": new_total_reviews,
                            "reviews": user_ratings,
                        }
                    },
                )
                return JsonResponse(
                    {
                        "message": "Rated successfully!!!",
                        "success": True,
                        "rating": new_ratings,
                        "total_reviews": new_total_reviews,
                    },
                    status=200,
                )
        except Exception as e:
            return JsonResponse(
                {
                    "error": str(e),
                    "success": False,
                },
                status=500,
            )


@csrf_exempt
@api_view(["POST"])
def add_to_favourites(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            recipe = data["recipeName"]
            category = data["category"]
            username = data["username"]
            user = get_user(username)
            user_favs = user["favourites"]
            recipe_details = get_recipe(recipe)
            fav_recipe = {
                "title": recipe,
                "image": recipe_details.get("image", ""),
                "rating": recipe_details.get("rating", ""),
            }
            recipes = user_favs.get(category, [])
            recipes.append(fav_recipe)
            user_favs[category] = recipes
            db.update_one({"username": username}, {"$set": {"favourites": user_favs}})
            return JsonResponse(
                {
                    "message": "Added successfully!!!",
                    "success": True,
                },
                status=200,
            )
        except Exception as e:
            return JsonResponse(
                {
                    "error": str(e),
                    "success": False,
                },
                status=500,
            )


@csrf_exempt
@api_view(["POST"])
def remove_from_favourites(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            recipe = data["recipeName"]
            category = data["category"]
            username = data["username"]
            user = get_user(username)
            user_favs = user["favourites"]
            upd_user_favs = {}
            final_user_favs = {}
            for category in user_favs:
                upd_user_favs[category] = []
                for recipes in user_favs[category]:
                    if recipes["title"] != recipe:
                        upd_user_favs[category].append(recipes)
            for key, item in upd_user_favs.items():
                if item != []:
                    final_user_favs[key] = item
            db.update_one(
                {"username": username}, {"$set": {"favourites": final_user_favs}}
            )
            return JsonResponse(
                {
                    "message": "Removed successfully!!!",
                    "success": True,
                },
                status=200,
            )
        except Exception as e:
            print(str(e))
            return JsonResponse(
                {
                    "error": str(e),
                    "success": False,
                },
                status=500,
            )


@csrf_exempt
@api_view(["POST"])
def get_recipes_blogs_for_home(request):
    if request.method == "POST":
        try:
            blog = client["Test_project"]["blogs"]
            data = json.loads(request.body)
            main_blog = blog.aggregate(
                [
                    {"$sample": {"size": 1}},
                    {
                        "$project": {
                            "_id": 0,
                            "pub_date": 1,
                            "author": 1,
                            "title": 1,
                            "image": 1,
                            "paragraphs": 1,
                        }
                    },
                ]
            )

            main_blog = next(main_blog, None)

            side_blogs = blog.aggregate(
                [
                    {"$sample": {"size": 4}},
                    {
                        "$project": {
                            "_id": 0,
                            "pub_date": 1,
                            "author": 1,
                            "title": 1,
                            "image": 1,
                            "paragraphs": 1,
                        }
                    },
                ]
            )

            side_recipes = get_random_recipes(5)
            main_recipes = get_random_recipes(4)

            return JsonResponse(
                {
                    "message": "Fetched successfully!!",
                    "success": True,
                    "main_blog": dict(main_blog),
                    "main_recipes": list(main_recipes),
                    "side_blogs": list(side_blogs),
                    "side_recipes": list(side_recipes),
                },
                status=200,
            )
        except Exception as e:
            return JsonResponse(
                {
                    "error": str(e),
                    "success": False,
                },
                status=500,
            )


@csrf_exempt
@api_view(["POST"])
def get_all_recipes(request):
    try:
        all_recipes = get_all_recipes_from_db()
        return JsonResponse(
            {
                "recipes": all_recipes,
                "message": "Fetched successfully!!!",
                "success": True,
            },
            status=200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "error": str(e),
                "success": False,
            },
            status=500,
        )


# @csrf_exempt
# @api_view(["POST"])
# def upload_recipe(request):
#     if request.method == "POST":
#         EXTERNAL_IMAGE_DIR = "C:/Users/OM/Desktop/DeliciousHaven/DeliciousHaven/my-project/public/recipe_imgs"

#         # Extract form data and files
#         username = request.POST.get("username")
#         title = request.POST.get("title")
#         category = request.POST.get("category")
#         ingredients = request.POST.get("ingredients")  # JSON string
#         directions = request.POST.get("directions")  # JSON string
#         details = request.POST.get("details")  # JSON string
#         recipe_image = request.FILES.get("recipeImage")

#         if not username or not recipe_image:
#             return JsonResponse(
#                 {"error": "Username or recipe image is missing."}, status=400
#             )

#         # Ensure the username subfolder exists
#         user_folder = os.path.join(EXTERNAL_IMAGE_DIR, username)
#         if not os.path.exists(user_folder):
#             os.makedirs(user_folder)

#         # Define the file path for the recipe image
#         file_path = os.path.join(user_folder, f"{title}.jpg")

#         # Create FileSystemStorage object with overwrite capability
#         fs = FileSystemStorage(location=user_folder)

#         # Check if the file already exists and overwrite it
#         if fs.exists(f"{title}.jpg"):
#             fs.delete(f"{title}.jpg")

#         fs.save(f"{title}.jpg", recipe_image)

#         # Get the relative path to store in the database
#         relative_file_path = os.path.join(
#             "/recipe_imgs", username, f"{title}.jpg"
#         ).replace("\\", "/")

#         # Parse the JSON string for ingredients, directions, and details
#         try:
#             ingredients_list = json.loads(ingredients)
#             directions_list = json.loads(directions)
#             details_obj = json.loads(details)
#         except json.JSONDecodeError as e:
#             return JsonResponse({"error": f"Invalid JSON format: {str(e)}"}, status=400)

#         # MongoDB collection
#         recipes = client["Test_project"]["recipes"]

#         # Save recipe to MongoDB
#         recipe_data = {
#             "username": username,
#             "upload_date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
#             "title": title,
#             "category": category,
#             "image": relative_file_path,
#             "ingredients": ingredients_list,
#             "directions": directions_list,
#             "details": details_obj,
#             "rating": 0,
#             "total_reviews": 0,
#             "favourite": False,
#             "comments": [],
#             "reviews": {},
#         }

#         # Insert into MongoDB
#         try:
#             recipes.insert_one(recipe_data)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#         return JsonResponse({"success": True, "file_path": relative_file_path})

#     return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
@api_view(["POST"])
def upload_recipe(request):
    if request.method == "POST":
        username = request.POST.get("username")
        title = request.POST.get("title")
        category = request.POST.get("category")
        ingredients = request.POST.get("ingredients")  # JSON string
        directions = request.POST.get("directions")  # JSON string
        details = request.POST.get("details")  # JSON string
        recipe_image = request.FILES.get("recipeImage")

        if not username or not recipe_image:
            return JsonResponse(
                {"error": "Username or recipe image is missing."}, status=400
            )

        # Upload the recipe image to Cloudinary
        try:
            upload_result = cloudinary.uploader.upload(recipe_image, folder=f"recipe_imgs/{username}")
            file_url = upload_result['secure_url']
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        # Parse the JSON string for ingredients, directions, and details
        try:
            ingredients_list = json.loads(ingredients)
            directions_list = json.loads(directions)
            details_obj = json.loads(details)
        except json.JSONDecodeError as e:
            return JsonResponse({"error": f"Invalid JSON format: {str(e)}"}, status=400)

        # MongoDB collection
        recipes = client["Test_project"]["recipes"]

        # Save recipe to MongoDB
        recipe_data = {
            "username": username,
            "upload_date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "title": title,
            "category": category,
            "image": file_url,  # Store the Cloudinary URL
            "ingredients": ingredients_list,
            "directions": directions_list,
            "details": details_obj,
            "rating": 0,
            "total_reviews": 0,
            "favourite": False,
            "comments": [],
            "reviews": {},
        }

        # Insert into MongoDB
        try:
            recipes.insert_one(recipe_data)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        return JsonResponse({"success": True, "file_path": file_url})

    return JsonResponse({"error": "Invalid request method."}, status=405)