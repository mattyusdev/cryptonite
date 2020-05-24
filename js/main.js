$(() => {
    localStorage.clear()
    $('.coinscontainer').fadeIn(1000);

    let liveReports = []
    let coins = []
    let interval;
    let options = {
        animationEnabled: false,
        animationDuration: 500,
        theme: "light2",
        backgroundColor: "transparent",
        colorSet: "customColorSet1",
        title: {
            text: ""
        },
        axisY: {
            title: "Coin Value",
            valueFormatString: "#0",
            suffix: "$",
        },
        legend: {
            cursor: "pointer",
            itemclick: toogleDataSeries
        },
        toolTip: {
            shared: false
        },
        data: []
    }

    CanvasJS.addColorSet("customColorSet1",
        [
            "#ff6e08",
            "#ff1138",
            "#2424b5",
            "#00b1f2",
            "#9c00ff"
        ]);

    $('.nav-link:eq(0), #logo').click(e => {
        e.preventDefault();

        $('.searchcontainer').hide()
        $('.coinscontainer').hide();
        $('main').removeClass('getstarted');
        $('.coinscontainer').empty();
        $('.coinscontainer').append(`
        <header class="col-6-sm">
            <h1>Get live</h1>
            <h2>Crypto currency data</h2>
            <h3>compare between coins & see live changes</h3>
            <button class="gradient" id="getstartedbtn" type="button">Get Started</button>
        </header>
        <div class="col-6-sm text-right">
            <img id="header" src="img/headerimg4.png" alt="">
        </div>
        `)
        $('.coinscontainer').fadeIn();

        getStarted();

        if (e.target.id != 'logo') {
            closeResNav();
        }


    })

    getStarted();

    function getStarted() {

        $('.nav-link:eq(1), #getstartedbtn').click(e => {
            e.preventDefault();

            $('.searchcontainer').show()
            $('main').addClass('getstarted');
            $('.coinscontainer').empty();
            $('.coinscontainer').append(`
        <div class="spinner-border"></div>
        `);


            clearInterval(interval);
            options.data = [];

            $.get('https://api.coingecko.com/api/v3/coins/list', data => {
                coins = data;
                addCoins(100, coins)
                $('.coinscontainer').hide();
                $('.coinscontainer').fadeIn();

                $('input[type="text"]').keyup((e) => {
                    if ($('input[type="text"]').val() == '') {
                        addCoins(100, coins)
                    }
                    else {
                        let filcoins = [];
                        filcoins = coins.filter(coin => {
                            if (coin.symbol.toLowerCase() == e.target.value.toLowerCase() || coin.name.toLowerCase() == e.target.value.toLowerCase()) {
                                return coin
                            }
                        })

                        addCoins(filcoins.length, filcoins)
                    }
                })

            })

            if (e.target.id != 'getstartedbtn') {
                closeResNav();
            }

        })
    }

    $('.nav-link:eq(2)').click(e => {
        e.preventDefault();

        $('.searchcontainer').hide()
        $('.coinscontainer').empty();
        $('main').addClass('getstarted');
        $('.coinscontainer').append(`
        <div class="spinner-border"></div>
        `);


        $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${liveReports}&tsyms=USD`, data => {
            let upperLiveReports = liveReports.map(item => item.toLocaleUpperCase())

            if (liveReports.length == 0) {
                options.title.text = 'You have not selected coins.'
            }
            else {
                options.title.text = `${liveReports} to USD`;
            }

            options.data = [];

            for (let i = 0; i < upperLiveReports.length; i++) {
                options.data.push({
                    type: "line",
                    lineThickness: 6,
                    name: upperLiveReports[i],
                    markerSize: 13,
                    showInLegend: true,
                    xValueFormatString: "HH:mm:ss",
                    yValueFormatString: "#0.000$",
                    dataPoints: [
                        { x: new Date(), y: data[upperLiveReports[i]].USD },

                    ]
                })
            }

            interval = setInterval(() => {
                $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${liveReports}&tsyms=USD`, data => {

                    for (let i = 0; i < upperLiveReports.length; i++) {
                        options.data[i].dataPoints.push({ x: new Date(), y: data[upperLiveReports[i]].USD })
                        $("#chartContainer").CanvasJSChart(options);
                    }

                })
            }, 5000);

            $('.coinscontainer').empty();
            $('.coinscontainer').append(`
            <div id="chartContainer" style="height: 370px; width: 100%;"></div>
            `);
            $('.coinscontainer').hide();
            $('.coinscontainer').fadeIn();
            $("#chartContainer").CanvasJSChart(options);

        })

        closeResNav();

    })

    $('.nav-link:eq(3)').click(e => {
        e.preventDefault();

        $('.searchcontainer').hide()
        $('.coinscontainer').empty();
        $('.coinscontainer').hide();
        $('main').addClass('getstarted');
        $('.coinscontainer').append(`
        <div class="about">
            <h1>Cryptonite is client-side web app
            for crypto currency information, 
            comparasion and live values.
            </h1>
            <h3>Made with <span>♥</span> by Matan.</h3>
        </div>
        `)
        $('.coinscontainer').fadeIn();
        closeResNav();
    })

    function toogleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    function addCoins(length, arrName) {
        $('.coinscontainer').empty();
        for (let i = 0; i < length; i++) {
            $('.coinscontainer').append(`
                <div class="card text-center cardframe">
                    <div class="card-body">
                        <label class="switch">
                            <input id="input-${arrName[i].symbol}" class="maintoggle" type="checkbox">
                            <span class="slider round"></span>
                        </label>
                        <h3 class="card-title">${arrName[i].symbol}</h3>
                        <h4 class="card-text">${arrName[i].name}</h4>
                        <button type="button" class="gradient moreinfobtn" data-toggle="collapse" data-target="#id${arrName[i].id}">More Info</button>
                        <div id="id${arrName[i].id}" class="collapse moreinfo row">
                            <div class="spinner-border"></div>
                        </div>
                    </div>
                </div>
            `)

            if (liveReports.indexOf(arrName[i].symbol) != -1) {
                $(`#input-${arrName[i].symbol}`)[0].checked = true;
            }

            $('input.maintoggle').eq(i).click(e => {
                if ($('input.maintoggle').eq(i)[0].checked) {
                    if (liveReports.length < 5) {
                        liveReports.push(arrName[i].symbol);
                    }
                    else {
                        $('.modal-body').empty();
                        for (let i = 0; i < liveReports.length; i++) {
                            $('.modal-body').append(`
                            <div class="coinframe">
                                <h4>${liveReports[i]}</h4>
                                <label class="switch">
                                    <input id=input-modal-${liveReports[i]} class="popuptoggle" type="checkbox" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            `)
                        }

                        $('.savebtn').click(() => {
                            liveReports = liveReports.filter((item) => {
                                if ($(`#input-modal-${item}`)[0].checked == true) {
                                    return item;
                                }
                                else {
                                    if ($(`#input-${item}`)[0] != undefined) {
                                        $(`#input-${item}`)[0].checked = false;
                                    }
                                }
                            })
                        })

                        $("#myModal").modal();
                        e.preventDefault();

                    }
                }
                else {
                    liveReports.splice(liveReports.indexOf(arrName[i].symbol), 1)
                }

            })

            $('.moreinfobtn').eq(i).click(e => {
                let moreInfoId = e.target.dataset.target;
                let slicedId = moreInfoId.slice(3);

                $.get(`https://api.coingecko.com/api/v3/coins/${slicedId}`, coin => {

                    if (localStorage.getItem(slicedId) == null) {

                        addMoreInfo(moreInfoId,
                            coin.image.small,
                            slicedId,
                            coin.market_data.current_price.usd,
                            coin.market_data.current_price.eur,
                            coin.market_data.current_price.ils)

                        localStorage.setItem(JSON.stringify(slicedId), JSON.stringify(
                            {
                                'usd': coin.market_data.current_price.usd,
                                'eur': coin.market_data.current_price.eur,
                                'ils': coin.market_data.current_price.ils,
                                'img': coin.image.small
                            }
                        ))

                        setTimeout(() => {
                            localStorage.removeItem(JSON.stringify(slicedId))
                        }, 120000)
                    }
                    else {
                        let parsedItem = JSON.parse(localStorage.getItem(slicedId))

                        addMoreInfo(moreInfoId,
                            slicedId,
                            parsedItem.usd,
                            parsedItem.eur,
                            parsedItem.ils,
                        )
                    }
                })
            })
        }
    }

    function addMoreInfo(target, img, alt, usd, eur, ils) {
        $(target).empty();
        $(target).append(`
                        <div class="col-4">
                            <img src=${img} alt=${alt}>
                        </div>
                        <ul class="col-8">
                            <li><strong>USD: </strong> ${usd}$</li>
                            <li><strong>EUR: </strong> ${eur}€</li>
                            <li><strong>ILS: </strong> ${ils}₪</li>
                        </ul>
                    `);
    }

    function closeResNav() {
        if ($(window).width() < 991) {
            setTimeout(() => {
                $('button.navbar-toggler').click();
            }, 500)
        }
    }
})