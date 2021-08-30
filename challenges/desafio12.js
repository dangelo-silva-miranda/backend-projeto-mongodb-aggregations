/*
Desafio 12
Usando a pipeline anterior que retorna o dia com mais viagens,
determine qual estação tem o maior número de viagens nesse dia da semana.

-Exiba apenas o nome da estação e o total de viagens.

Dica: Utilize o operador $dayOfWeek para extrair o dia da semana como um número de uma data.

O resultado da sua query deve ter exatamente o seguinte formato (incluindo a ordem dos campos):

{
  "nomeEstacao" : <nome_da_estacao>,
  "total" : <total_de_viagens>
}
*/
/*
  Material consultado sobre $lookup:
  https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#perform-multiple-joins-and-a-correlated-subquery-with--lookup

  Material consultado sobre $unwind:
  https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/#unwind-array
*/
db.trips.aggregate([
  {
    $group: {
      _id: {
        $dayOfWeek: "$startTime",
      },
      total: {
        $sum: 1,
      },
    },
  },
  {
    $project: {
      _id: 0,
      diaDaSemana: "$_id",
      total: "$total",
    },
  },
  {
    $sort: {
      total: -1,
    },
  },
  {
    $limit: 1,
  },
  {
    $lookup: {
      let: {
        trips_diaDaSemana: "$diaDaSemana",
      },
      from: "trips",
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: [
                "$$trips_diaDaSemana",
                {
                  $dayOfWeek: "$startTime",
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$startStationName",
            total: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            nomeEstacao: "$_id",
            total: "$total",
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
        {
          $limit: 1,
        },
      ],
      as: "stationData",
    },
  },
  {
    $unwind: "$stationData",
  },
  {
    $project: {
      nomeEstacao: "$stationData.nomeEstacao",
      total: "$stationData.total",
    },
  },
]);
