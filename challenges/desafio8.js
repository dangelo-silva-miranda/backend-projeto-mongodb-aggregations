/*
Desafio 8
Trocando de contexto, vamos utilizar nossa outra coleção que contém dados de
  empresas aéreas, suas rotas, seus voos e parcerias.

Liste todas as parcerias da coleção air_alliances, que voam rotas com um
  Boing 747 ou um Airbus A380 , para descobrir qual delas tem o maior número
  de rotas com esses aviões.

No campo airplane, na coleção air_routes:

-Boing 747 está abreviado para 747
-Airbus A380 está abreviado para 380

O resultado da sua query deve ter exatamente o seguinte formato (incluindo a ordem dos campos):

{
  "_id" : <nome_da_alianca>,
  "totalRotas" : <total_de_rotas>
}
*/
/*
  Material consultado sobre $lookup:
  https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#perform-multiple-joins-and-a-correlated-subquery-with--lookup

  Material consultado sobre $count:
  https://docs.mongodb.com/manual/reference/operator/aggregation/count-accumulator/#use-in--group-stage

  Material consultado sobre $unwind:
  https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/#unwind-array

  Material consultado sobre $first:
  https://docs.mongodb.com/manual/reference/operator/aggregation/first-array-element/
*/
db.air_alliances.aggregate([
  {
    $lookup: {
      let: {
        alliances_airlines: "$airlines",
      },
      from: "air_routes",
      pipeline: [
        {
          $match: {
            $and: [
              { airplane: { $in: ["380", "747"] } },
              { $expr: { $in: ["$airline.name", "$$alliances_airlines"] } },
            ],
          },
        },
        {
          $group: {
            _id: null,
            totalRotas: {
              $count: {},
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalRotas: 1,
          },
        },
      ],
      as: "routedata",
    },
  },
  {
    $project: {
      _id: "$name",
      totalRotas: { $first: "$routedata.totalRotas" },
    },
  },
  {
    $sort: {
      totalRotas: -1,
    },
  },
  {
    $limit: 1,
  },
]);
