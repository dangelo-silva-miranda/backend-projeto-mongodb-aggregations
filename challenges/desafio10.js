/*
Desafio 10
Encontre a duração média de viagens por tipo de usuário.

-Exiba o valor em horas com apenas duas casas decimais
-Exiba a média de viagens ordenada de forma crescente.

Para arredondar a média use o $round.

O resultado da sua query deve ter exatamente o seguinte formato (incluindo a ordem dos campos):

{
  "tipo" : <tipo>,
  "duracaoMedia" : <duracaoMedia>
}
// ...
*/
/*
  Material consultado sobre uso de $subtract para dates:
  https://docs.mongodb.com/manual/reference/operator/aggregation/subtract/#subtract-two-dates

  Material consultado sobre uso de $avg no estágio $group:
  https://docs.mongodb.com/manual/reference/operator/aggregation/avg/#use-in--group-stage

  Material consultado sobre $divide:
  https://docs.mongodb.com/manual/reference/operator/aggregation/divide/

  Material consultado sobre uso do $let para definir variáveis:
  https://docs.mongodb.com/manual/reference/operator/aggregation/let/

  Material consultado sobre $round:
  https://docs.mongodb.com/manual/reference/operator/aggregation/round/
*/
db.trips.aggregate([
  {
    $group: {
      _id: "$usertype",
      duracaoMediaInMilliseconds: {
        $avg: {
          $subtract: ["$stopTime", "$startTime"],
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      tipo: "$_id",
      duracaoMedia: {
        $let: {
          vars: {
            oneHourInMilliseconds: { $multiply: [60, 60, 1000] },
          },
          in: { $divide: ["$duracaoMediaInMilliseconds", "$$oneHourInMilliseconds"] },
        },
      },
    },
  },
  {
    $project: {
      tipo: 1,
      duracaoMedia: {
        $round: ["$duracaoMedia", 2],
      },
    },
  },
  {
    $sort: {
      duracaoMedia: 1,
    },
  },
]);
