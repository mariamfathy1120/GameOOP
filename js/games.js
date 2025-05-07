let gamesArray = [];
export class GamesData {
  async displayGames(categoryName) {
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "98645577a4msh977783e4291ab78p10f1dajsnc0490f53a8eb",
        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      },
    };

    let gameDataReq = await fetch(
      `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${categoryName}`,
      options
    );

    gamesArray = await gameDataReq.json();
    console.log(gamesArray);

    return gamesArray;
  }
}
