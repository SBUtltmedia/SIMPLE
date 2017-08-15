//Click destory typing game
var Simple = {
    layerInfo: {},
    currentGame: "IndexGame",
    health: 3,
    layerIndex: 0,
    layersLeft: [],
    choiceLayer: {},
    score: 0,
    queryKeys: {},
    init: function () {
        $.getJSON("resourcesDynamic/simple.json", Simple.loadSimple);
        $("#healthDisplayBox").css({
            visibility: "hidden"
        })
        $("#heart1, #heart2, #heart3").css({
            visibility: "hidden"
        })
        $("#guessBox").css({
            visibility: "hidden"
        })
    },
    gameInit: function () {
        Simple.health = 3;
        Simple.layersLeft = Simple.layerInfo.layers.slice(1)
        Simple.refreshLayerNames();
        Simple.makeHoverEvents(Simple.layerInfo.layers.length);
        $("#heart1, #heart2, #heart3").removeClass("heartDie")
        $("#displayCorrect img").css({
            display: "none"
        });
        $("#layerName li").css({
            display: "none"
        })
        $("#healthDisplayBox").css({
            visibility: "visible"
        })
        $("#heart1, #heart2, #heart3").css({
            visibility: "visible"
        })
        $("#picture").css({
            display: "block"
        })
    },
    getUrlVars: function () {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    refreshLayerNames: function () {
        Simple.layerInfo.layers.forEach(function (item, index) {
            $("#" + item.id).html(item.lname);
        })
    },
    populateLayerDivs: function (info) {
        $(info.layers).each(function (index, item) {
            var Objli = $('<li></li>');
            Objli.text(item.lname)
            Objli.attr("id", item.id)
            Objli.attr("data-name", item.lname)
            Objli.attr("class", item.id)
            var layerImage = $('<img></img>');
            layerImage.attr("src", "resourcesDynamic/images/layer-" + item.id + ".png")
            layerImage.attr("id", "image-" + item.id)
            layerImage.attr("data-name", item.lname)
            layerImage.attr("class", item.id)
            if (index == 0) {
                Objli.appendTo("#headerName")
                layerImage.appendTo("#background")
            } else {
                Objli.appendTo("#layerName")
                layerImage.appendTo("#displayCorrect")
            }
        })
    },
    populateImageMap: function (data) {
        for (var i = 0; i < data.imageMap.branches.length; i++) {
            showTree(data.imageMap.branches[i]);
        }

        function showTree(tree) {
            width = data.imageMap.mapWidth;
            height = data.imageMap.mapHeight;
            if (tree["pt"] && tree["id"] != 0) {
                var newDiv = $('<a></a>');
                newDiv.css("left", tree["pt"][1] / width * 100 + "%");
                newDiv.css("top", tree["pt"][0] / height * 100 + "%");
                newDiv.css("width", tree["sz"] / width * 100 + "%");
                newDiv.css("height", tree["sz"] / width * 100 + "%");
                newDiv.attr("class", tree["id"] + " map")
                newDiv.attr("href", "#")
                //newDiv.css("border","1px solid blue");
                $('#nav').append(newDiv)
            }
            tree["cd"].forEach(function (item, index) {
                showTree(item);
            });
        }
    },
    loadSimple: function (data) {
        Simple.populateImageMap(data);
        Simple.populateLayerDivs(data);
        Simple.makeHoverEvents(data.layers.length)
        Simple.gameSelectorButtons();
        Simple.queryKeys = Simple.getUrlVars();
        var local = localStorage.getItem(Simple.queryKeys["local"])
        console.log(local)
        $("#background img,#picture, #nav, #dragHome,#displayCorrect img").css({
            "width": data.width + "%",
            "height": data.height + "%"
        })
        Simple.layerInfo = data;
        var game = Simple.queryKeys["game"]
        if (game) {
            game = game.toLowerCase()
        } else {
            game = ""
        }
        if (game == "typing") {
            TypingGame.init();
        } else if (game == "selector") {
            SelectorGame.init();
        } else if (game == "drag") {
            DragGame.init();
        } else {
            IndexGame.init();
        }
    },
    gameSelectorButtons: function () {
        $("#buttonBox").children().each(function (index, value) {
            $(value).click(function (evt) {
                switch (evt.target.id) {
                    case "indexCardButton":
                        IndexGame.init();
                        break;
                    case "typingGameButton":
                        TypingGame.init();
                        break;
                    case "selectorGameButton":
                        SelectorGame.init();
                        break;
                }
            });
        })
    },
    makeHoverEvents: function (numberOfLayers) {
        var size = Math.floor(256 / numberOfLayers);
        for (var i = 1; i <= numberOfLayers; i++) {
            if (i > 1) {
                $("." + i + ", #" + i).hover(Simple.handlerHover, Simple.handlerHover);
            }
            $("#" + i).addClass("fs-" + size);
        }
    },
    handlerHover: function (event) {
        var hoverData = {
            "mouseenter": {
                "bgcolor": "#4e2a7f"
            },
            "mouseleave": {
                "bgcolor": "#3a3a3a"
            }
        }
        var currentSelection = $(event.target).attr("class").split(" ")[0];
        var picEl = $("#picture")
        var picNum = currentSelection;
        picname = "resourcesDynamic/images/layer-" + picNum + ".png";
        if (event.type != "mouseenter") {
            picname = "resourcesLinked/images/system/1px.png";
        }
        picEl.attr("src", picname);
        $("#" + currentSelection).css({
            "background-color": hoverData[event.type].bgcolor
        })
    },
    setMessage: function (message, isTemp) {
        if (isTemp) {
            $("#tempMessage").remove();
            var tempDiv = $('<div>' + message + '</div>');
            tempDiv.attr("id", "tempMessage")
            $("#message").append(tempDiv);
            $("#permMessage").css("visibility", "hidden");
            Simple.clickBlocker.create();
            $("#tempMessage").stop().fadeTo(2000, 0, function () {
                Simple.clickBlocker.destory();
                $("#permMessage").css("visibility", "visible");
            })
        } else {
            $("#permMessage").stop().fadeTo(5, 0, function () {
                $("#permMessage").html(message);
                $("#permMessage").stop().fadeTo(5, 1, function () {
                    // Animation complete.
                });
            });
        }
    },
    wonGame: function () {
        Simple.score = 33 * Simple.health + 1;
        if (Simple.score == 100) {
            Simple.overlay.create("You Won! Perfect!");
        } else {
            Simple.overlay.create("You Won! <br>" + "Your Score: " + Simple.score);
        }
        var local = JSON.parse(localStorage.getItem(Simple.queryKeys["local"]) || "{}");
        local[Simple.queryKeys["key"]] = Simple.score
        localStorage.setItem(Simple.queryKeys["local"], JSON.stringify(local))
        Simple.destory();
        IndexGame.init();
    },
    lostGame: function () {
        Simple.score = 0;
        Simple.overlay.create("You Lost! <br>" + "Your Score: " + Simple.score);
        Simple.destory();
        IndexGame.init();
    },
    damage: function (heartIndex) {
        $('#heart' + heartIndex).addClass("heartDie")
        Simple.health--;
        Simple.layersLeft.splice(Simple.layerIndex, 1)
        if (Simple.health == 0) {
            Simple.lostGame();
            return;
        }
    },
    pickLayer: function (isCorrect) {
        console.log("total layers: " + Simple.layerInfo.layers.length, " layersLeft: " + Simple.layersLeft.length)
        if (Simple.layersLeft.length == 0) {
            Simple.wonGame();
            return false;
        }
        if (isCorrect) {
            Simple.layerIndex = Math.floor(Math.random() * Simple.layersLeft.length)
        }
        Simple.choiceLayer = Simple.layersLeft[Simple.layerIndex];
        var isTemp = false;
        return true;
    },
    overlay: {
        create: function (text) {
            var layerOverlay = $('<div></div>');
            // send score to the server
            $.ajax({
                type: "POST",
                url: "resourcesLinked/getData.php",
                data: {
                    "SimpleName": Simple.layerInfo.layers[0].lname,
                    "currentGame": Simple.currentGame,
                    "score": Simple.score
                },
                success: function (data) {
                    console.log(data);
                }
            });
            $("#stage").append(layerOverlay)
            layerOverlay.attr("id", "overlay")
            layerOverlay.load("resourcesLinked/overlay.htm", function () {
                $("#overlayText").html(text);
                $('#overlayButton').click(function () {
                    Simple.overlay.destroy();
                    Simple.destory();
                    IndexGame.init();
                })
            })
        },
        destroy: function () {
            $("#overlay").remove();
        }
    },
    clickBlocker: {
        create: function () {
            var blocker = $('<div></div>');
            $("#stage").append(blocker);
            blocker.attr("id", "blocker");
        },
        destory: function () {
            $("#blocker").remove();
        }
    },
    destory: function () {
        SelectorGame.destory();
        TypingGame.destory();
        DragGame.destory();
    }
}
var SelectorGame = {
    init: function () {
        Simple.destory();
        Simple.gameInit();
        Simple.currentGame = "SelectorGame";
        SelectorGame.pickLayer(true);
        $(".map").unbind("click").click(function (evt) {
            SelectorGame.clickedItem(evt)
        })
    },
    clickedItem: function (evt) {
        var isCorrect = true;
        var layerPicked = $(evt.target).attr("class").split(" ")[0];
        var isTemp = true;
        if (layerPicked == Simple.choiceLayer.id) {
            Simple.setMessage("Correct!", isTemp)
            $("#image-" + Simple.choiceLayer.id).css({
                display: "block"
            })
            $("#" + Simple.choiceLayer.id).css({
                display: "block"
            })
            $("#tempMessage").css("background-color", "green")
            Simple.layersLeft.splice(Simple.layerIndex, 1)
        } else {
            Simple.setMessage("Please try again", isTemp)
            $("#tempMessage").css("background-color", "red")
            isCorrect = false;
            Simple.damage(Simple.health, Simple.layerIndex)
            if (Simple.health == 0) {
                Simple.lostGame();
                return;
            }
        }
        SelectorGame.pickLayer(isCorrect)
    },
    destory: function () {
        $("#displayCorrect img").css({
            display: "none"
        });
        $(".map").unbind("click");
    },
    pickLayer: function (isCorrect) {
        var isTemp = false;
        if (Simple.pickLayer(isCorrect)) {
            Simple.setMessage("Please select: <span class='blink'>" + Simple.choiceLayer.lname + "</span>", isTemp)
        }
    }
}
var TypingGame = {
    lettersShown: [],
    lastTime: 0,
    answerString: "",
    delaySecs: 2,
    questionStartTime: 0,
    animationFrameID: 0,
    init: function () {
        Simple.destory();
        Simple.gameInit();
        Simple.currentGame = "TypingGame";
        $("#guessBox").css({
            visibility: "visible"
        })
        TypingGame.pickLayer(true);
        $(".map").unbind();
        // Make a array [1...n] shufflle it
        $("#userInput").focus();
        $("#userInput").on('blur', function () {
            $("#userInput").focus();
        })
        TypingGame.pickLetter();
        $("#userInput").unbind("keydown").keydown(function (evt) {

            TypingGame.typedLetter(evt)
        });
        $("#userInput").submit(function (evt) {
          console.log("hi");
        });

    },
    pickLayer: function (isCorrect) {
        TypingGame.guessMessageDisplay.destroy();
        $("#userInput").val("")
        TypingGame.lastTime = 0;
        var isTemp = false;
        TypingGame.questionStartTime = new Date().getTime();
        if (Simple.pickLayer(isCorrect)) {
            Simple.setMessage("What is the highlighted layer on the right?", isTemp)
            $("#" + Simple.choiceLayer.id).css({
                display: "block"
            })
            $("#" + Simple.choiceLayer.id).text("")
            TypingGame.lettersShown = TypingGame.shuffle(Array.from(Array(Simple.choiceLayer.lname.length).keys()))
            TypingGame.answerString = Simple.choiceLayer.lname.replace(/[^ ]/g, "*").split('')
            TypingGame.pickLetter();
        }
    },
    highlightPicture: function () {
        $("#image-" + Simple.choiceLayer.id).css({
            display: "block"
        })
    },
    guessMessageDisplay: {
        showMessage: function (message) {
            $("#" + Simple.choiceLayer.id).text(message);
        },
        destroy: function () {
            window.cancelAnimationFrame(TypingGame.animationFrameID);
        }
    },
    typedLetter: function (evt) {
        var isTemp = true;
        var inputText = document.getElementById("userInput").value;
        var lastIndex = inputText.length - 1
        if ((inputText[lastIndex] && Simple.choiceLayer.lname.split('')[lastIndex]) && inputText[lastIndex].toLowerCase() == Simple.choiceLayer.lname.split('')[lastIndex].toLowerCase()) {
        TypingGame.answerString[lastIndex] = inputText[lastIndex]
            $("#" + Simple.choiceLayer.id).text(TypingGame.answerString.join(""));
        }

        TypingGame.checkCorrect(inputText,evt);

    },
    checkCorrect: function(inputText,evt ){
      if (inputText.toLowerCase() == Simple.choiceLayer.lname.toLowerCase()) {
          Simple.setMessage("Correct!", isTemp)
          $("#" + Simple.choiceLayer.id).css({
              display: "block"
          })
          $("#tempMessage").css("background-color", "green")
          $("#image-" + Simple.choiceLayer.id).css({
              display: "none"
          })
          Simple.layersLeft.splice(Simple.layerIndex, 1)
          TypingGame.pickLayer(true);

      }else {

          if (evt.which==13){

              Simple.damage(Simple.health, Simple.layerIndex);
          }


      }




    },
    pickLetter: function () {
        var currTime = new Date().getTime();
        if (currTime >= TypingGame.lastTime + TypingGame.delaySecs * 1000) {
            var shufflePick = TypingGame.lettersShown[0];
            TypingGame.answerString[shufflePick] = Simple.choiceLayer.lname[shufflePick];
            TypingGame.lettersShown.shift();
            TypingGame.lastTime = currTime;
            TypingGame.highlightPicture();
            TypingGame.guessMessageDisplay.showMessage(TypingGame.answerString.join(""));
            if (TypingGame.lettersShown.length == 0) {
                Simple.damage(Simple.health, Simple.layerIndex);

                // Pick a new object
                $("#image-" + Simple.choiceLayer.id).css({
                    display: "none"
                })
                TypingGame.pickLayer(true);
            }
        } // one second has passed, run some code here
        window.cancelAnimationFrame(TypingGame.animationFrameID);
        if (Simple.currentGame == "TypingGame") {
            TypingGame.animationFramID = window.requestAnimationFrame(TypingGame.pickLetter);
        }
    },
    destory: function () {
        TypingGame.guessMessageDisplay.destroy();
        window.cancelAnimationFrame(TypingGame.animationFramID);
        $("#guessBox").css({
            visibility: "hidden"
        });
    },
    shuffle: function (array) {
        let counter = array.length;
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);
            // Decrease counter by 1
            counter--;
            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
}
var IndexGame = {
    init: function () {
        Simple.destory();
        Simple.gameInit();
        Simple.currentGame = "IndexGame";
        var indexMessage = "Hover over a piece of the image to highlight the name on the left";
        $("#layerName li").css({
            display: "block"
        })
        $("#healthDisplayBox").css({
            visibility: "hidden"
        })
        $("#heart1, #heart2, #heart3").css({
            visibility: "hidden"
        })
        var isTemp = false;
        Simple.setMessage(indexMessage, isTemp);
    }
}
var DragGame = {
    init: function () {
        Simple.destory();
        Simple.gameInit();
        Simple.currentGame = "DragGame";
        Simple.setMessage("Please drag", isTemp)
        $("#buttonBox").css({
            visibility: "hidden"
        })
        $('#imagemap').prepend("<div id='dragHome'></div>");
        var layerCount = Simple.layerInfo.layers.length;
        var isTemp = true;
        console.log(layerCount)
        loop = 1;
        $("<img/>") // Make in memory copy of image to avoid css issues
            .attr("src", $("#background img").attr("src")).load(function () {
                var pic_real_width = this.width;
                var pic_real_height = this.height;
                while (layerCount - loop++) {
                    $('.' + loop).unbind("hover");
                    dragItem = "<img id='drag-" + loop + "' src='resourcesDynamic/images/drag-layer-" + loop + ".png'/>";
                    $('#dragHome').append(dragItem)
                    $("<img/>") // Make in memory copy of image to avoid css issues
                        .attr("src", $("#drag-" + loop).attr("src")).load(function () {
                            var item = $(this).attr("src").split("-")[2].split(".")[0]
                            var percentHeight = this.height / pic_real_height * 100;
                            var percentWidth = this.width / pic_real_width * 100;
                            $("#drag-" + item).css("width", percentWidth + "%")
                            $("#drag-" + item).css("height", percentHeight + "%")
                            $("#drag-" + item).css("float", "left")
                            $("#drag-" + item).css("position", "relative")
                        })
                }
                $('#dragHome').children().draggable({
                    stack: "img",
                    revert: true
                }).on("dragstop", function (evt) {
                    Simple.setMessage("Please try again", isTemp)
                    $("#tempMessage").css("background-color", "red")
                    Simple.damage(Simple.health, Simple.layerIndex)
                    if (Simple.health == 0) {
                        Simple.lostGame();
                        return;
                    }
                });
            })
        $('.map').droppable({
            drop: function (event, ui) {
                var dropped = $(event.target).attr("class").charAt(0)
                var dragged = ui.draggable.attr('id').split("-")[1]
                if (dragged == dropped && !$("#drop-" + dropped).length) {
                    $("#drag-" + dragged).remove();
                    dragItem = "<img id='drop-" + dropped + "' src='resourcesDynamic/images/layer-" + dropped + ".png'/>";
                    $('#imagemap').append(dragItem)
                    $("#drop-" + dropped).attr("style", $('#background').attr("style"))
                    $("#drop-" + dropped).css("position", "absolute")
                    $("#drop-" + dropped).css("width", width / 2 + "%")
                    $("#drop-" + dropped).css("height", height / 2 + "%")
                    $("#drop-" + dropped).css("z-index", 100 + dropped);
                    Simple.setMessage("Correct!", isTemp)
                    $("#tempMessage").css("background-color", "green")
                }
                if ($("#dragHome").children().length == 0) {
                    Simple.wonGame();
                }
                console.log(layerCount);
            }
        });
        $('#layerName').html("")
    },
    destory: function () {
        $('#dragHome').css({
            display: "none"
        })
        $('#imagemap img').css({
            display: "none"
        })
    }
}
$(function () {
    Simple.init();
    resizeWindow();
})
