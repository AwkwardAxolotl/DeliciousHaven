import re
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()


def connect_to_database():
    client = MongoClient(os.getenv("MONGO_DB_CON_STR"))
    db = client["Test_project"]["userbase"]
    return db, client


def get_all_recipes_from_db():
    db, client = connect_to_database()
    recipes = client["Test_project"]["recipes"]
    return list(
        recipes.find(
            {},
            {
                "_id": 0,
                "category": 1,
                "title": 1,
                "ingredients": 1,
                "details": 1,
                "rating": 1,
                "total_reviews": 1,
                "image": 1,
            },
        )
    )


def distinct_categories():
    db, client = connect_to_database()
    recipe_db = client["Test_project"]["recipes"]
    return recipe_db.distinct("category")


def get_recipes_by_category(category_name):
    db, client = connect_to_database()
    recipe_db = client["Test_project"]["recipes"]
    recipes_cursor = recipe_db.find({"category": category_name})
    recipes_data = []

    for recipe_doc in recipes_cursor:
        recipe_data = {
            "category": recipe_doc.get("category", ""),
            "title": recipe_doc.get("title", ""),
            "ingredients": recipe_doc.get("ingredients", []),
            "details": recipe_doc.get("details", {}),
            "directions": recipe_doc.get("directions", []),
            "rating": recipe_doc.get("rating", ""),
            "total_reviews": recipe_doc.get("total_reviews", ""),
            "favorite": recipe_doc.get("favorite", ""),
            "image": recipe_doc.get("image", ""),
        }
        recipes_data.append(recipe_data)
    return recipes_data


def get_recipes_by_ingredients(ingredients):
    db, client = connect_to_database()
    recipe_db = client["Test_project"]["recipes"]
    recipes = recipe_db.find(
        {},
        {
            "_id": 0,
            "category": 1,
            "title": 1,
            "ingredients": 1,
            "details": 1,
            "rating": 1,
            "total_reviews": 1,
            "image": 1,
        },
    )
    filtered_recipes = []
    for recipe in recipes:
        try:
            if filter_recipes(recipe["ingredients"], ingredients):
                filtered_recipes.append(recipe)
        except:
            continue
    return filtered_recipes


def filter_recipes(recipe_ingredients, input_ingredients):
    recipe_bool = [True] * len(input_ingredients)

    for no, input_ingredient in enumerate(input_ingredients):
        for recipe_ingredient in recipe_ingredients:
            if (input_ingredient.lower()) not in (recipe_ingredient.lower()):
                recipe_bool[no] = False
            else:
                recipe_bool[no] = True
                break
    if False in recipe_bool:
        return False
    else:
        return True


def get_recipes_by_category_and_ingredient(category_name, ingredients):
    regex_patterns = [
        re.compile(f".*\\b{re.escape(ingredient)}\\b.*", re.IGNORECASE)
        for ingredient in ingredients
    ]
    db, client = connect_to_database()
    recipe_db = client["Test_project"]["recipes"]

    recipes_cursor = recipe_db.find(
        {
            "category": category_name,
            "ingredients": {
                "$elemMatch": {"$regex": regex_patterns[0].pattern, "$options": "i"}
            },
        }
    )

    recipes_data = []

    for recipe_doc in recipes_cursor:
        if filter_recipes(recipe_doc.get("ingredients", []), ingredients):
            recipe_data = {
                "category": recipe_doc.get("category", ""),
                "title": recipe_doc.get("title", ""),
                "ingredients": recipe_doc.get("ingredients", []),
                "details": recipe_doc.get("details", {}),
                "directions": recipe_doc.get("directions", []),
                "rating": recipe_doc.get("rating", ""),
                "total_reviews": recipe_doc.get("total_reviews", ""),
                "favorite": recipe_doc.get("favorite", ""),
                "image": recipe_doc.get("image", ""),
            }
            recipes_data.append(recipe_data)

    return recipes_data


def get_random_recipes(size):
    db, client = connect_to_database()
    recipe_db = client["Test_project"]["recipes"]
    random_recipes = recipe_db.aggregate(
        [
            {"$sample": {"size": size}},
            {
                "$project": {
                    "_id": 0,
                    "category": 1,
                    "title": 1,
                    "ingredients": 1,
                    "details": 1,
                    "rating": 1,
                    "total_reviews": 1,
                    "image": 1,
                }
            },
        ]
    )
    return random_recipes


def get_recipe(title):
    db, client = connect_to_database()
    recipe_db = client["Test_project"]["recipes"]
    recipe = recipe_db.find_one(
        {"title": title},
        {
            "_id": 0,
            "category": 1,
            "title": 1,
            "ingredients": 1,
            "details": 1,
            "directions": 1,
            "rating": 1,
            "total_reviews": 1,
            "image": 1,
            "comments": 1,
            "reviews": 1,
        },
    )
    return recipe


def get_user(username):
    db, client = connect_to_database()
    return db.find_one({"username": username})


def get_favs_from_user(username):
    favourites = get_user(username)["favourites"]
    return list(favourites)
