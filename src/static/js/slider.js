    
    var sliderModule =(function(){


        var _initiateSlider = function(data) {
            
            var totalTicks = data.length;
            
            document.getElementsByTagName('input')[0].setAttribute('max', totalTicks -1);
            
            var sliderEl = document.getElementById('sliderticks')
            // set a constant padding value to align the numbers in the slider with the slider itself
            var constantPaddingLeft = '10px';
            var PADDING = 4;
            // for (let i = 0 ; i < totalTicks ; i++) {
            //     let listItem = document.createElement('li');
                

            //     listItem.style.width = 100/totalTicks + '%'
            //     listItem.classList += 'ticks'
            //     if (i > 0) {
            //         listItem.style.paddingLeft += ( parseFloat(constantPaddingLeft.split('px')[0]) + PADDING) + 'px';
            //     }
                
            //     let snippet = document.createTextNode((i+1)*5);
                
            //     listItem.appendChild(snippet);
            //     sliderEl.appendChild(listItem);
            // }
            let divItem = document.createElement('div');
            divItem.classList.add("clearfix");
            sliderEl.appendChild(divItem)
            return true;
        }

        var _moveSlider = function(pointToMove) {
            console.log('move', pointToMove);
            document.querySelector('input[type=range]').value = pointToMove;
        }

        return {
            setSlider: _initiateSlider,
            moveSlider: _moveSlider
            }


    })();

