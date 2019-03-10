
const ori = document.getElementById('ori')

function hide_ori()
{
    ori.style.display = ''
    ori.style.transition = ''

    setTimeout(setup_animate, 1)
}

function animate_ori2()
{
    ori.style.left = '10000px'
    setTimeout(hide_ori, 10000)
}

function animate_ori()
{
    ori.style.transition = 'left linear 10s'
    setTimeout(animate_ori2, 1);
}

function show_ori()
{
    //console.log('Ori')

    ori.style.display = 'block'
    ori.style.left = '-200px'

    setTimeout(animate_ori, 1);
}

function animate()
{
    setTimeout(show_ori, 1);
}

function setup_animate()
{
    const wait = 3 + 2*Math.random()
    //console.log(wait)
    setTimeout(animate, wait * 60 * 1000)
}

setup_animate()