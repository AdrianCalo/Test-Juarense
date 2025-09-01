const { Builder, By, until }= require("selenium-webdriver");

(async function testRegister(){
    let driver = await new Builder().forBrowser("chrome").build();

    try{
        //abrimos la pagina
        await driver.get("http://localhost:3000");

        //Espero que cargue el link para acceder al registro
      let registroAqui= await driver.findElement(By.linkText("aquí"));
      registroAqui.click();
    
       //espero que cambie la url a /register
       await driver.wait(until.urlContains("/register"),5000);

       //obtenemos la URL del sitio accedido
       let currentUrl= await driver.getCurrentUrl();
       console.log("URL actual:", currentUrl);

       //validamos que sea la correcta
       if(currentUrl === "http://localhost:3000/register"){
        console.log("Redireccion correcta✅")
       }else {
        console.log("Redireccion incorrecta ❌");
       }
   
//buscamos los imput y los completamos 

await driver.findElement(By.id("name")).sendKeys("name");
await driver.findElement(By.id("lastname")).sendKeys("lastname");
await driver.findElement(By.id("email")).sendKeys("email@gmail.com");
await driver.findElement(By.id("password")).sendKeys("pass");
//al ser formato date selenium espero el formato yyyy/mm/dd
await driver.findElement(By.id("birthday")).sendKeys("1990/10/05");
await driver.findElement(By.id("dni")).sendKeys("00000000");

//buscamos el boton enviar para guardar los datos

let btnEnviar = await driver.findElement(By.xpath("//button[contains(text(),'Enviar')]")
);
await btnEnviar.click(); 

//esperamos mensaje de exito
//como no se el id, pude ejecutar cargando un usuario nuevo y pararlo para ssaber los atributos ndesde la devtools
const mensajeExito= await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Registro exitoso. Redirigiendo a Página de Login.')]")),
    5000);
    console.log("mensaje mostrado:", await mensajeExito.getText());

//clase del mensaje de exito por si no funiona aplicar==> class="go3958317564"

//una vez realizada la carga de datos y enviados la pagina redirecciona a login
//verificamos que redireccione al inicio
let newCurrentUrl= await driver.getCurrentUrl();
console.log("nueva url:",newCurrentUrl);

//validamos que sea la correcta la nueva url
       if(newCurrentUrl === "http://localhost:3000"){
        console.log("Redireccion a login correcta✅")
       }else {
        console.log("Redireccion incorrecta ❌");
       }

//fijate porque en postaman no coincide la url, deberia ser /auth/login pero
//en la web no me figura asi, simplemente es :3000


    }catch(error){
        console.error("❌ error en el test:", error);
    }finally{
        await driver.quit();
    }
})();