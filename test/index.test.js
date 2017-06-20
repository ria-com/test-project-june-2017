"use strict";

const QStoES = require('../index'),
    expect = require("chai").expect;

describe('Обычные запросы', function () {
  it('brand.id=9&model.id=98', function () {
    return expect(QStoES('brand.id=9&model.id=98')).to.deep.equal({
      "query": {
        "bool": {
          "must": [
            {"term": {"brand.id": {"value": "9"}}},
            {"term": {"model.id": {"value": "98"}}}
          ]
        }
      }
    });
  });
  it('price=10000', function () {
    return expect(QStoES('price=10000')).to.deep.equal({
      "query": {
        "bool": {
          "must": [
            {"term": {"price": {"value": "10000"}}}
          ]
        }
      }
    });
  });
});
describe('Запросы с массивами', function () {
  it('brand.id[0]=9&brand.id[1]=10', function () {
    return expect(QStoES('brand.id[0]=9&brand.id[1]=10'))
        .to.deep.equal({
          "query": {
            "bool": {
              "must": [
                {
                  "term": {
                    "brand.id": {"value": "9"}
                  }
                },
                {
                  "term": {
                    "brand.id": {"value": "10"}
                  }
                }
              ]
            }
          }
        });
  });
});
describe('Запросы с диапазонами', function () {
  it('price.gte=5000&price.lte=10000', function () {
    return expect(QStoES('price.gte=5000&price.lte=10000')).to.deep.equal({
      "query": {
        "bool": {
          "must": [
            {"range": {"price": {"gte": "5000", "lte": "10000"}}}
          ]
        }
      }
    });
  });
  it('price.gte=5000', function () {
    return expect(QStoES('price.gte=5000')).to.deep.equal({
      "query": {
        "bool": {
          "must": [
            {"range": {"price": {"gte": "5000"}}}
          ]
        }
      }
    });
  });
});
describe('Запросы с массивами диапазонов', function () {
  it('price[0].gte=5000&price[0].lte=7500&price[1].gte=15000&price[1].lte=20000', function () {
    return expect(QStoES('price[0].gte=5000&price[0].lte=7500&price[1].gte=15000&price[1].lte=20000'))
        .to.deep.equal({
          "query": {
            "bool": {
              "must": [
                {"range": {"price": {"gte": "5000", "lte": "7500"}}},
                {"range": {"price": {"gte": "15000", "lte": "20000"}}}
              ]
            }
          }
        });
  });
});
describe('Запросы с исключениями', function () {
  it('brand.id.not=9&price=10000', function () {
    return expect(QStoES('brand.id.not=9&price=10000')).to.deep.equal({
      "query": {
        "bool": {
          "must": [
            {"term": {"price": {"value": "10000"}}}
          ],
          "must_not": [
            {"term": {"brand.id": {"value": "9"}}}
          ]
        }
      }
    });
  });
});
describe('Запросы с группами', function () {
  it('brand.id=9&model.id=98&group=brand.id,model.id', function () {
    return expect(QStoES('brand.id=9&model.id=98&group=brand.id,model.id')).to.deep.equal({
      "query": {
        "bool": {
          "must": [
            {
              "bool": {
                "must": [
                  {
                    "term": {
                      "brand.id": {
                        "value": "9"
                      }
                    }
                  },
                  {
                    "term": {
                      "model.id": {
                        "value": "98"
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    });
  });
  it('brand.id[0]=9&model.id[0]=98&brand.id[1]=10&model.id[1]=113&group=brand.id,model.id', function () {
    return expect(QStoES('brand.id[0]=9&model.id[0]=98&brand.id[1]=10&model.id[1]=113&group=brand.id,model.id'))
        .to.deep.equal({
          "query": {
            "bool": {
              "must": [
                {
                  "bool": {
                    "must": [
                      {"term": {"brand.id": {"value": "9"}}},
                      {"term": {"model.id": {"value": "98"}}}
                    ]
                  }
                },
                {
                  "bool": {
                    "must": [
                      {"term": {"brand.id": {"value": "10"}}},
                      {"term": {"model.id": {"value": "113"}}}
                    ]
                  }
                }
              ]
            }
          }
        })
  });
});
describe('Запросы с группами и исключениями', function () {
  it('brand.id[0].not=9&model.id[0].not=98&brand.id[1]=10&model.id[1]=113&group=brand.id,model.id', function () {
    return expect(QStoES('brand.id[0].not=9&model.id[0].not=98&brand.id[1]=10&model.id[2]=113&group=brand.id,model.id'))
        .to.deep.equal({
          "query": {
            "bool": {
              "must_not": [
                {
                  "bool": {
                    "must": [
                      {"term": {"brand.id": {"value": "9"}}},
                      {"term": {"model.id": {"value": "98"}}}
                    ]
                  }
                }
              ],
              "must": [
                {
                  "bool": {
                    "must": [
                      {"term": {"brand.id": {"value": "10"}}},
                      {"term": {"model.id": {"value": "113"}}}
                    ]
                  }
                }
              ]
            }
          }
        });
  });
});
