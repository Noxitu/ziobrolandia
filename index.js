function encode(text)
{
  return new TextEncoder().encode(text)
}

function get_key_material(password) 
{  
  //console.log(password)
  const key = encode(password)
  //console.log(key)

  return window.crypto.subtle.importKey(
    "raw", 
    key,
    {name: "PBKDF2"}, 
    false, 
    ["deriveBits", "deriveKey"]
  )
}

async function get_key(password)
{
  const key_material = await get_key_material(password)
  //console.log(key_material)

  return await window.crypto.subtle.deriveKey(
    {
      "name": "PBKDF2",
      salt: encode("salt"),
      "iterations": 1000000,
      "hash": "SHA-256"
    },
    key_material,
    { "name": "AES-GCM", "length": 256},
    true,
    [ "encrypt", "decrypt" ]
  )
}

async function decrypt(key, cryptogram)
{
  //console.log(key)
  const crypto_buffer = Uint8Array.from(atob(cryptogram), c => c.charCodeAt(0))
  const buffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: encode("iv")
    },
    key,
    crypto_buffer
  )
  
  return new Uint8Array(buffer).reduce( (data, byte) => data + String.fromCharCode(byte), '')
  //return String.fromCharCode.apply(null, new Uint8Array(buffer))
}
  
async function is_key_correct(key)
{
  try
  {
    return await decrypt(key, await cryptogram_password_ok) == "password is ok"
  }
  catch(e) 
  {
    return false
  }
}

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