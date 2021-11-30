$.js = function (el) {
    return $('[data-js=' + el + ']')
};

function carousel() {
    $.js('timeline-carousel').slick({
        infinite: false,
        arrows: true,
        arrows: true,
        prevArrow:
            `<div class="slick-prev"> 
            <div class="btn  btn-slick mr-3  d-flex justify-content-center align-items-center"> 
            <i class="far fa-chevron-left"></i>
            </div>
        </div>`,
        nextArrow:
            `<div class="slick-next"> 
            <div class="btn btn-slick  d-flex justify-content-center align-items-center"> 
            <i class="far fa-chevron-right"></i>
            </div>
        </div>`,

        dots: true,
        autoplay: false,
        speed: 1100,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
    });
}

carousel();



// pause video when close modal 
var stopVideo = function(modal) {
    var iframe = modal.querySelector('iframe');
    if (iframe) {
        var iframeSrc = iframe.src;
        iframe.src = iframeSrc;
    }
};

var modalList = document.querySelectorAll('.modal')


modalList.forEach(function(modal){  

    var modalContent = modal.querySelector('.modal-content')
    var modalBody = modal.querySelector('.modal-body')
    
    modal.addEventListener('click', function () {
        stopVideo(modal)
    })
    
    
    modalBody.addEventListener('click', function (e) {
        e.stopPropagation()
    })
})    
