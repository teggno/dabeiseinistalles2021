function mapByValorSymbol(prices){
    return prices
        .reduce(function (prev, current) {
            var valorSymbol = current.valorSymbol
            var group = prev[valorSymbol]
            if (group) {
                group.prices.push(current)
            }
            else {
                group = { prices: [current], shortName: current.shortName }
                prev[valorSymbol] = group
            }
            return prev
        }, {})
}

function calculateRankingList(referenceDate, byValorSymbol, players) {
    Object.values(byValorSymbol)
        .forEach(function (group) {
            group.prices = group.prices
                .filter(function (item) {
                    return item.lastDate >= referenceDate
                })
                // sort descending by lastDate
                .sort(function (a, b) {
                    return a.lastDate > b.lastDate ? -1 : a.lastDate === b.lastDate ? 0 : 1
                })
            
            // THIS ONLY WORKS BECAUSE WE'VE SORTED THE PRICES BY lastDate DESCENDING ABOVE!
            var lastItem = group.prices[group.prices.length - 1]
            if (lastItem && lastItem.lastDate === referenceDate) {
                group.referenceDatePrice = lastItem.closingPrice
            }
            group.prices.forEach(function (item) {
                item.performance = calculatePerformance(group.referenceDatePrice, item.closingPrice)
                item.referenceDatePrice = group.referenceDatePrice
            })
        })

    return players.map(function (player) {
        var performances = player.bets
            .map(function (valorSymbol) {
                var ofSymbol = byValorSymbol[valorSymbol]
                if (!ofSymbol) {
                    console.log("symbol not found in prices", valorSymbol)
                }
                return {
                    valorSymbol: valorSymbol,
                    latest: ofSymbol.prices[0],
                    previous: ofSymbol.prices[1]
                }
            })
        
        return {
            name: player.name,
            performances: performances,
            totalPerformance: performances.reduce(function (prev, current) {
                return {
                    latest: prev.latest + current.latest.performance,
                    previous: prev.previous + current.previous.performance
                }
            }, { latest: 0, previous: 0 })
        }
    })
    .sort(function (a, b) {
        return b.totalPerformance.latest - a.totalPerformance.latest
    })

}

function rangkingListHtmlTable(rankingListData) {
    var rows = rankingListData
        .map(function (item) {
            return '<tr>' +
                '<td class="ph2 pv1 tr">' + calculateRank(item, rankingListData) + '.</td>' +
                '<td class="ph2 pv1">' + item.name + '</td>' +
                '<td class="ph2 pv1 tr">' + formatPercent(item.totalPerformance.latest) + '%</td>' +
                '</tr>'
        }).join("")

    return '<table class="collapse center"><tbody>' + rows + '</tbody></table>'
}

function calculateRank(item, allItems) {
    return allItems.filter(function (iitem) {
        return iitem.totalPerformance.latest > item.totalPerformance.latest
    }).length + 1
}

function getValorSymbolsUsed() {
    var map = getBets()
        .reduce(function(prev, current) {
            current.bets.forEach(function(valorSymbol){
                prev[valorSymbol.toUpperCase()] = null
            })
            return prev
        }, {})

    return Object.keys(map).sort(function(a, b) { return a > b ? 1 : a === b ? 0 : -1 })
}

function calculatePerformance(refPrice, latestPrice) {
    return latestPrice / refPrice - 1
}

function formatPercent(value) {
    return (Math.round(value * 10000) / 100).toFixed(2)
}

function getBets() {
    var raw = [
        ["Banquette/Kurt Meier", "Logn", "fhzn", "ROG", "Uhr"],
        ["Fritz Gschwend", "ams", "ROG", "oerl", "abbn"],
        ["Koni+Sylvia", "scmn", "novn", "logn", "csgn"],
        ["Tanino Liotta", "fhzn", "soon", "UBSG", "AUTN"],
        ["Von Känel Peter", "UBSG", "novn", "Uhr", "nesn"],
        ["Geni+Erika Gremli", "novn", "CFR", "ROG", "soon"],
        ["Chaschtä+Nunzia Carrieri", "nesn", "kud", "novn", "ROG"],
        ["René Benz", "novn", "nesn", "ROG", "STMN"],
        ["Severin Stucky", "nesn", "ROG", "zurn", "temn"],
        ["Katy+Urs Näf", "fhzn", "DUFN", "valn", "Ams"],
        ["Baggerstubä", "csgn", "novn", "nesn", "ROG"],
        ["Heidi+Roger Blatter", "ROG", "LOGN", "STMN", "temn"],
        ["Made+Donato Carrieri", "nesn", "ROG", "novn", "valn"],
        ["Antonia+Rolf Weigel", "csgn", "ROG", "temn", "nesn"],
        ["Stefania+Christian Zingg", "csgn", "ROG", "zurn", "abbn"],
        ["Zac", "novn", "LOGN", "zurn", "scmn"],
        ["Speranza+Edwin Steuble", "ROG", "csgn", "scmn", "zurn"],
        ["Dog", "Uhr", "kud", "AUTN", "valn"],
        ["Alex+Mario", "novn", "ROG", "scmn", "valn"],
        ['"Brünette" Wacker', "zurn", "UBSG", "ROG", "kud"],
        ["Regula+Franco Monferini", "nesn", "soon", "novn", "scmn"],
        ["Urs Affentranger", "novn", "Logn", "zurn", "kud"],
        ["Gina+Bruno Meier", "novn", "ROG", "nesn", "csgn"],
        ["Peter Beranek", "nesn", "novn", "ROG", "STMN"],
        ["Susanne Ruch+Christian Forster", "ROG", "UBSG", "fhzn", "AUTN"],
        ["Lilly+Raffaele", "ROG", "ams", "CFR", "STMN"],
        ["Zeljko Berger", "novn", "scmn", "csgn", "arbn"],
        ["Eva+Markus Heitz", "Uhr", "CFR", "zurn", "csgn"],
        ["Emma+Christian", "Logn", "arbn", "temn", "nesn"],
        ["Moni+Coc Brandes", "nesn", "novn", "ROG", "DUFN"],
        ["Markus Lüthi", "UBSG", "novn", "ROG", "nesn"],
        ["Andy Hermann", "ROG", "scmn", "IMPN", "nesn"],
        ["Inge Berger", "novn", "ROG", "nesn", "STMN"],
        ["Rosa+Marlen", "AUTN", "ams", "soon", "ROG"],
        ["Leni+Luciano Schüepp", "novn", "nesn", "ROG", "scmn"]
    ]

    return raw.map(function (src) {
        return { name: src[0], bets: [src[1].toUpperCase(), src[2].toUpperCase(), src[3].toUpperCase(), src[4].toUpperCase()] }
    })
}

function parseDate(yyyymmdd){
    return new Date(parseInt(yyyymmdd.substr(0, 4)), parseInt(yyyymmdd.substr(4, 2)) - 1, parseInt(yyyymmdd.substr(6, 2)))
}

function formatDate(date) {
    return date.getDate().toString() + "." + (date.getMonth() + 1).toString() + "." + date.getFullYear().toString()
}