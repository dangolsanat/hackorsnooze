"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

async function fetchCurrentUser() {
  try {
    const response = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}`, {
      params: {
        token: currentUser.loginToken
      }
    });
    return response.data.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error; // Handle or propagate the error as needed
  }
}


/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}


// async function getFavOnStart(){
//   favList = await User.fav();
//   putFavStoriesOnPage();
// }


/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(storyObj) {
  // console.debug("generateStoryMarkup");
  const story= new Story(storyObj)
  const hostName = story.getHostName();
  
  return $(`
      <li id="${story.storyId}">
        
        <i class="star far fa-star toggleFav"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function generateMyStoriesMarkup(storyObj) {
  // console.debug("generateStoryMarkup", story);
  const story= new Story(storyObj);
  const hostName = story.getHostName();
  
  return $(`
      <li id="${story.storyId}">
        <i class="fas fa-trash deleteStory"></i>
        <i class="star far fa-star toggleFav"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

async function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  storyList = await StoryList.getStories();
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    await $allStoriesList.append($story);
  }

   $allStoriesList.show();
}



/** Gets list of Favorite stories from server, generates their HTML, and puts on page. */

async function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");
  $favStoriesList.empty();

  const {favorites}= await fetchCurrentUser();
  console.log('favorites:', favorites);

  for (let story of favorites) {
    const $storys = generateStoryMarkup(story);
    $favStoriesList.append($storys);
  }
  $favStoriesList.show();
  // $favSection.show();
}
 

/** Gets list of User stories from server, generates their HTML, and puts on page. */

async function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $userStoriesList.empty();

  const {stories}= await fetchCurrentUser();
  console.log('favorites:', stories);

  for (let story of stories) {
    const $story = generateMyStoriesMarkup(story);
    $userStoriesList.append($story);
  }
  // console.log(currentUser.stories);
   $userStoriesList.show();
}





$allStoriesList.on("click", ".toggleFav", async function(event) {
  try {
    const token=localStorage.getItem("token");
    let currentUser = await fetchCurrentUser();
    console.log(currentUser);
    const storyId = event.target.closest("li").id;
    const response = await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${storyId}`, {
      token: token
    });

    return response.data;

  } catch (error) {
    console.error('Error favoriting story:', error);
  }
});


$userStoriesList.on("click", ".deleteStory", async function(event) {
    const storyId = event.target.closest("li").id;
    // const response = await axios.delete(
    //   `https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`,
    //   {
    //     data: { token: currentUser.loginToken }
    //   }
    // );
    await fetchCurrentUser();

      await storyList.deleteStory(currentUser,storyId);
      await putUserStoriesOnPage();

});







$storySubmit.on("submit", async function(event) {
event.preventDefault();
  let newStory = {
    title: $titleInput.val(),
    author: $authorInput.val(),
    url: $urlInput.val()
    }

      const storyList = await StoryList.getStories();
      let createdStory = await storyList.addStory(currentUser, newStory);
      console.log("Created story:", createdStory);

      await putStoriesOnPage();  
      $storyForm.hide();

  }
);

