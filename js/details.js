export class GetGameDetails{
  async displayDetails(id) {
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "98645577a4msh977783e4291ab78p10f1dajsnc0490f53a8eb",
        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      },
    };
    let gameDetailsReq = await fetch(
      `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`,
      options
    );
    let gameDetails = await gameDetailsReq.json();
    return gameDetails;
  }
}