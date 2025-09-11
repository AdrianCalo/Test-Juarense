//importo la url desde variables.js
const BaseUrl= require("./variableURL");

const { Builder, By, until }= require("selenium-webdriver");

(async function testRegister(){
    let driver = await new Builder().forBrowser("chrome").build();

    try{
        //abrimos la pagina
        await driver.get(BaseUrl);

        //Espero que cargue el link para acceder al registro
      let registroAqui= await driver.wait(
        until.elementLocated(By.partialLinkText("aquí")),5000);
      await registroAqui.click();
      console.log("Se hizo click en boton 'AQUI'");
    
       //espero que cambie la url a /register
       await driver.wait(until.urlContains("/register"),5000);
       
       console.log("Esperando que cambie la URL a /register")
       
       //obtenemos la URL del sitio accedido
       let currentUrl= await driver.getCurrentUrl();
       console.log("URL actual:", currentUrl);

       //validamos que sea la correcta
       if(currentUrl === `${BaseUrl}/register`){
        console.log("Redireccion correcta✅")
       }else {
        console.log("Redireccion incorrecta ❌");
       }
   
//buscamos los imput y los completamos 
console.log("Completamos los campos...")
await driver.findElement(By.id("name")).sendKeys("name");
await driver.findElement(By.id("lastname")).sendKeys("lastname");
await driver.findElement(By.id("email")).sendKeys("email10@gmail.com");
await driver.findElement(By.id("password")).sendKeys("pass");
//al ser formato date selenium espero el formato yyyy/mm/dd(se ponia asi, pero dps no se que paso)
await driver.findElement(By.id("birthdate")).sendKeys("05/10/1990");
await driver.findElement(By.id("dni")).sendKeys("00000000");
console.log("Se completaron los campos.")


//buscamos el boton enviar para guardar los datos
console.log("Esperamos qeu se presione el boton 'Enviar'...")
let btnEnviar = await driver.findElement(By.xpath("//button[contains(text(),'Enviar')]")
);
await btnEnviar.click(); 
console.log('se presiono el boton enviar')

//esperamos mensaje de exito
//como no se el id, pude ejecutar cargando un usuario nuevo y pararlo para ssaber los atributos ndesde la devtools
const mensajeExito= await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Registro exitoso. Redirigiendo a Página de Login.')]")),
    10000);
    console.log("mensaje mostrado:", await mensajeExito.getText());

//clase del mensaje de exito por si no funiona aplicar==> class="go3958317564"

//una vez realizada la carga de datos y enviados la pagina redirecciona a login
//esperamoos que la URL cambie a la de login (Baseurl)

console.log("Esperando que aparezca el botón 'Ingresar' en la página de login...");
let loginButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(), 'Ingresar')]")),
        10000
);
if (loginButton) {
    console.log("Página de login detectada correctamente ✅");
} else {
    console.log("No se detectó el botón de login ❌");
}

// Ahora sí, obtenemos la URL actual y la comparamos con la base
let newCurrentUrl = await driver.getCurrentUrl();
console.log("Nueva url después del registro:", newCurrentUrl);

function normalizeUrl(url) {
        return url.replace(/\/$/, '');
}
if (normalizeUrl(newCurrentUrl) === normalizeUrl(BaseUrl)) {
        console.log("Redirección a login correcta✅");
} else {
        console.log("Redirección incorrecta ❌");
}


    }catch(error){
        console.error("❌ error en el test:", error);
    }finally{
        await driver.quit();
    }
})();
