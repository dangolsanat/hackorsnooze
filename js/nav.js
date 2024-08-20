"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);
$navSubmit.on("click", navSubmit);

/** Show story submit form on click on "submit" */

$navSubmit.on("click", navSubmit);

function navSubmit(evt){
  console.debug("navSubmit", evt);
  // hidePageComponents();
  $storyForm.show();
  
}

/** Show favorite page on click on "favorite" */


async function navFav(evt){
// location.reload();
  console.debug("navFavorite", evt);
  hidePageComponents();
  await putFavStoriesOnPage();
  // await getFav();
  $favSection.show();
}

$navFavorite.on("click", navFav);


async function navUser(evt){
  console.debug("navUser", evt);
  hidePageComponents();
  await fetchCurrentUser();
  await putUserStoriesOnPage();
  $userSection.show();
}

$navMyStories.on("click", navUser);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $(".far.fa-star").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navSubmit.show();
  $navFavorite.show();
  $loginForm.hide();
  $signupForm.hide();
  $navMyStories.show();

}

function hideStart(){
  $navSubmit.hide();
  $navFavorite.hide();
  $navMyStories.hide();
}
