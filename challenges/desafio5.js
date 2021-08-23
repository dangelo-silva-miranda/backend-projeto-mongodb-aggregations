/*
Desafio 5
Temos outra noite de filme aqui na Trybe e, desta vez, nós perguntamos
à equipe quais são suas pessoas preferidas como atores e/ou atrizes.
Aqui está o resultado:

-Sandra Bullock
-Tom Hanks
-Julia Roberts
-Kevin Spacey
-George Clooney

Considerando esta lista, crie uma pipeline que retorne o title do vigésimo
quinto filme da agregação que satisfaz as seguintes condições:

-countries é Estados unidos no banco estará classificado como USA
-tomatoes.viewer.rating maior ou igual a 3
-Crie um novo campo chamado num_favs, que represente quantos atores ou atrizes
  da nossa lista de favoritos aparecem no elenco (informação do campo cast no
  banco) do filme, caso ele possua favoritos.
-Ordene os resultados por num_favs, tomatoes.viewer.rating e title, todos em ordem
  decrescente.

Dica: coloque a lista de atores e atrizes favoritos em uma variável e explore
operadores como $size e $setIntersection.

O resultado da sua query deve ter exatamente o seguinte formato (incluindo a ordem dos campos):

{
  "title" : <nome_do_filme>
}
*/
/*
  Material consultado sobre uso do $let para definir variáveis:
  https://docs.mongodb.com/manual/reference/operator/aggregation/let/

  Material consultado sobre uso do $setIntersection:
  https://docs.mongodb.com/manual/reference/operator/aggregation/setIntersection/

  Material consultado sobre uso do $size in aggregations:
  https://docs.mongodb.com/manual/reference/operator/aggregation/size/
*/
db.movies.aggregate([
  {
    $match: {
      cast: {
        $in: [
          "Sandra Bullock",
          "Tom Hanks",
          "Julia Roberts",
          "Kevin Spacey",
          "George Clooney",
        ],
      },
      countries: "USA",
      "tomatoes.viewer.rating": {
        $gte: 3,
      },
    },
  },
  {
    $addFields: {
      num_favs: {
        $size: {
          $let: {
            vars: {
              actor_favs: [
                "Sandra Bullock",
                "Tom Hanks",
                "Julia Roberts",
                "Kevin Spacey",
                "George Clooney",
              ],
            },
            in: { $setIntersection: ["$cast", "$$actor_favs"] },
          },
        },
      },
    },
  },
  {
    $sort: {
      num_favs: -1,
      "tomatoes.viewer.rating": -1,
      title: -1,
    },
  },
  {
    $skip: 24,
  },
  {
    $limit: 1,
  },
  {
    $project: {
      _id: 0,
      title: 1,
    },
  },
]);
