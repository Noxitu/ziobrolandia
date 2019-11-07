
let done = false

const nope = new Audio('media/nope.mp3');

async function on_submit_impl(password)
{
  if (done) return

  document.body.classList.add('busy')
  const key = await get_key(password)
  const ok = await is_key_correct(key)
  
  if (!ok)
  {
    document.body.classList.remove('busy')
    document.getElementById('password').value = ''
    nope.play()
    return
  }

  if (done) return

  done = true

  document.activeElement.blur()

  document.getElementById('password').style.opacity = 0

  document.getElementById('main2').innerHTML = await decrypt(key, await cryptogram)

  document.body.classList.remove('busy')

  setTimeout(function()
  {
    document.getElementById('main2').classList.remove('hidden')
  }, 7000)
}

function on_submit(event)
{
  event.preventDefault()

  const password = document.getElementById('password').value.toLowerCase()
  on_submit_impl(password)
}

document.getElementById('form').addEventListener('submit', on_submit)