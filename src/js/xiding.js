document.addEventListener('DOMContentLoaded',function(){

   

    var header = document.querySelector('.header');
    var barrages = document.querySelector('.barrages');

   
    window.onscroll = function(){
                
        var scrollY = window.scrollY;
        
        if
            (scrollY >= barrages.offsetHeight){
             header.className ='header fixed';
             barrages.className = 'barrages mgb'; 
        }
        else
        {
            header.className ='header';
             barrages.className = 'barrages'; 
        }
    }
});