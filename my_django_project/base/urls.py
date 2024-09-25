from django.urls import path
from .views import (
    signUp,
    signIn,
    forgotPassword,
    valOTP,
    googleSignInUp,
    sendNewsletterEmail,
    send_contact_email,
    getBlogs,
    getSingleBlog,
    addComment,
    updateUserDetails,
    getUserDetails,
    uploadProfileImage,
    validateUser,
    getRecipes,
    get_single_recipe,
    add_ratings,
    add_to_favourites,
    get_recipes_blogs_for_home,
    get_all_recipes,
)

urlpatterns = [
    path("SignUp/", signUp, name="sign-up"),
    path("SignIn/", signIn, name="sign-in"),
    path("forPass/", forgotPassword, name="forgot-password"),
    path("valOTP/", valOTP, name="validate-otp"),
    path("GoogleSignUpIn/", googleSignInUp, name="google-auth"),
    path("SendNewsletter/", sendNewsletterEmail, name="send-newsletter"),
    path("sendContactEmail/", send_contact_email, name="send-contact-email"),
    path("getBlogs/", getBlogs, name="get-blogs"),
    path("getSingleBlog/", getSingleBlog, name="get-single-blog"),
    path("addComment/", addComment, name="add-comment"),
    path("getUserDetails/", getUserDetails, name="get-user-details"),
    path("updateUserDetails/", updateUserDetails, name="update-user-details"),
    path("uploadProfileImage/", uploadProfileImage, name="upload-profile-image"),
    path("validateUser/", validateUser, name="validate-user"),
    path("getRecipes/", getRecipes, name="get-recipes"),
    path("getSingleRecipe/", get_single_recipe, name="get-single-recipe"),
    path("ratings/", add_ratings, name="add-ratings"),
    path("addToFavourites/", add_to_favourites, name="add-to-favourites"),
    path(
        "getRecipesBlogs/",
        get_recipes_blogs_for_home,
        name="get-recipes-and-blogs-for-home",
    ),
    path("getAllRecipes/", get_all_recipes, name="get-all-recipes"),
]
