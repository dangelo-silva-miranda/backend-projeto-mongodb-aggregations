/*
Desafio 7
Vamos nos aprofundar um pouco mais em nossa coleção de filmes.

Conte quantos filmes cada um dos atores e atrizes do elenco (cast no banco)
  já participou e obtenha uma média do campo imdb.rating para cada um desses
  atores e atrizes.

-Traga o nome do ator ou atriz;
-Número de filmes em que participou
-Média do imdb desses filmes arredondada para uma casa decimal usando o operador $round.
-Considere somente os membros do elenco de filmes com o idioma inglês (English).
-Exiba a lista em ordem decrescente de documentos pelo número de filmes e nome do ator ou atriz.

Sua query deve retornar 47055 documentos. Cada documento no resultado deve ter
  exatamente o seguinte formato (incluindo a ordem dos campos):

{
  "_id" : "John Wayne",
  "numeroFilmes" : 107,
  "mediaIMDB" : 6.4
}
*/
/*
  Material consultado sobre $unwind:
  https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/#unwind-array

  Material consultado sobre $group:
  https://docs.mongodb.com/manual/reference/operator/aggregation/group/#-group--aggregation-

  Material consultado sobre $round:
  https://docs.mongodb.com/manual/reference/operator/aggregation/round/#example
*/
db.movies.aggregate([
  {
    $match: {
      languages: "English",
    },
  },
  {
    $unwind: "$cast",
  },
  {
    $group: {
      _id: "$cast",
      numeroFilmes: {
        $sum: 1,
      },
      mediaIMDB: {
        $avg: "$imdb.rating",
      },
    },
  },
  {
    $sort: {
      numeroFilmes: -1,
      _id: -1,
    },
  },
  {
    $project: {
      _id: 1,
      numeroFilmes: 1,
      mediaIMDB: {
        $round: ["$mediaIMDB", 1],
      },
    },
  },
]);
