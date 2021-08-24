/*
Desafio 6
Vamos explorar mais operadores aritméticos!

Considerando todos os filmes que ganharam o Oscar pelo menos uma vez, calcule o
 maior valor, menor valor, média e o desvio padrão das avaliações (informação do
 campo imdb.rating no banco).
  -Para a média e o desvio padrão arredonde os valores para uma casa decimal utilizando o $round.

Dica: todos os filmes na coleção, que já ganharam um Oscar (informação do campo
 awards no banco), começam com uma sequência de string parecida com essas abaixo,
 portanto $regex é um operador bem-vindo:

Won 10 Oscars
Won 1 Oscar

Utilizem o $stdDevSamp para calcular o desvio padrão.

O resultado da sua query deve ter exatamente o seguinte formato (incluindo a ordem dos campos):

{
  "maior_rating" : <maior_rating>,
  "menor_rating" : <menor_rating>,
  "media_rating" : <media_rating>,
  "desvio_padrao" : <desvio_padrao>
}
*/
/*
  Material consultado sobre $max:
  https://docs.mongodb.com/manual/reference/operator/aggregation/max/#use-in--group-stage

  Material consultado sobre $min:
  https://docs.mongodb.com/manual/reference/operator/aggregation/min/#use-in--group-stage

  Material consultado sobre $avg:
  https://docs.mongodb.com/manual/reference/operator/aggregation/avg/#use-in--group-stage

  Material consultado sobre $stdDevSamp:
  https://docs.mongodb.com/manual/reference/operator/aggregation/stdDevSamp/#use-in--group-stage

  Material consultado sobre $round:
  https://docs.mongodb.com/manual/reference/operator/aggregation/round/
*/
db.movies.aggregate([
  {
    $match: {
      awards: {
        $regex: /^Won [0-9]+ Oscar/,
      },
    },
  },
  {
    $group: {
      _id: null,
      maior_rating: {
        $max: "$imdb.rating",
      },
      menor_rating: {
        $min: "$imdb.rating",
      },
      media_rating: {
        $avg: "$imdb.rating",
      },
      desvio_padrao: {
        $stdDevSamp: "$imdb.rating",
      },
    },
  },
  {
    $project: {
      _id: 0,
      maior_rating: 1,
      menor_rating: 1,
      media_rating: {
        $round: ["$media_rating", 1],
      },
      desvio_padrao: {
        $round: ["$desvio_padrao", 1],
      },
    },
  },
]);
