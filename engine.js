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
}

async function encrypt(key, plaintext)
{
  const plain_buffer = Uint8Array.from(plaintext, c => c.charCodeAt(0))
  const buffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: encode("iv")
    },
    key,
    plain_buffer
  )

  return btoa(new Uint8Array(buffer).reduce( (data, byte) => data + String.fromCharCode(byte), ''))
}
  
async function is_key_correct(key)
{
  try
  {
    return await decrypt(key, await cryptogram_password_ok) == "password is ok"
  }
  catch(e) 
  {
    console.log(e)
    return false
  }
}