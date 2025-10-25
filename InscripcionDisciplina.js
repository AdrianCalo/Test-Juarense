/*Este metodo mostrara el happy path de la inscripcion
 a una disciplina de un usuario */

 //importo la url desde variables.js
 const BaseUrl=require("./variableURL");
 const {until, Builder, By, Select }= require("selenium-webdriver");

 const chrome= require("selenium-webdriver/chrome");    

 /*Por razones de comodidad usaremos el navegador Breve ya que con chrome 
 hemos tenido problemas por los popups que lanza e interfieren con el desarrollo del test*/

 (async function testInscripcionDisciplina(){
 //ruta al ejecutable de brave 
 const bravePath="C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe"
 //configuracion de Chome para limpiar Logs
 //Desactivamos servicios de Chrome para evitar errores

let options =new chrome.Options();
options.setChromeBinaryPath(bravePath);//indicamos que usa brave
options.addArguments('--disable-logging');
options.addArguments('--log-level=3');
options.addArguments("--disable-device-discovery-notifications");           
options.addArguments("--user-data-dir=C:/selenium-temp-profile");
options.addArguments("--disable-notifications");
options.addArguments("--disable-popup-blocking");
options.addArguments("--no-sandbox");
options.addArguments("--disable-gpu");
options.addArguments("--disable-infobars"); 
options.addArguments("--disable-save-password-bubble");

let driver= await new Builder()
.forBrowser("chrome")
.setChromeOptions(options)
.build();

try{
    console.log('iniciando el test')
    //abrimos la pagina
    await driver.get(BaseUrl);

    //esperamos que aparaezcan los imput del login y cargamos los datos de un usuario cualquiera

    let inputEmail= await driver.wait(
        until.elementLocated(By.id("email")),
        5000
    );
    await inputEmail.sendKeys("ElVigiGato@hotmail.com");

    //esperamos que aparezca el input password
    let inputPassword= await driver.wait(
        until.elementLocated(By.id("password")),
        5000
    );
    await inputPassword.sendKeys("pass");
    console.log("Se completo el formulario de login")

//buscamos el boton por texto y hacemos click
let btnIngresar= await driver.findElement(
    By.xpath("//button[contains(text(),'Ingresar')]")
);
await btnIngresar.click();
console.log("Se presiono el boton ingresar");

//esperamos que la url contenga "/profile" indicando que accdimos correctamente
await driver.wait(until.urlContains("/profile"),5000);

//verificamos que la url haya cambiado
let currentUrl=await driver.getCurrentUrl();
console.log("URL actual:", currentUrl);

//varificamos que sea correcta
if(currentUrl === `${BaseUrl}/profile`){
     console.log("Redirección correcta ✅");
} else {
console.log("Redirección incorrecta ❌"); 
}
console.log("****Accedemos a Actualizar datos para inscribirnos en una disciplina***");
console.log("buscando el linkText 'Actualizar Datos'");
/*
let Actauliza_link= await driver.findElement(By.linkText("Actualizar Datos"));
await Actauliza_link.click();
console.log("Se hizo click en Actualizar Datos");
*/
let actualizarLink = await driver.wait(
  until.elementLocated(By.xpath("//*[contains(text(),'Actualizar Datos')]")),
  10000
);
await driver.wait(until.elementIsVisible(actualizarLink), 5000);
await actualizarLink.click();
console.log("Se hizo click en 'Actualizar Datos'");


//verificamos que aparezca el titulo de la pagina "Actualziar Perfil"
let titleData= await driver.wait(
    until.elementLocated(
        By.xpath("//h2[contains(text(),'Actualizar Perfil')]")
    ),5000
);
console.log("Titulo de la pagina: ", await titleData.getText());

//sin cargar datos nos dirigimos a la seccion de disciplina

let titleInscription= await driver.wait(
    until.elementLocated(
        By.xpath("//h3[contains(text(),'Inscribirse a Disciplina')]")
    ),5000
);
if(titleInscription){
    console.log("Se encontro el formulario de inscripcion a disciplina")
}else{
    console.log("No se encontro el formulario de inscricion.")
};

//Completamos y enviamos el formulario.

// Esperar que aparezca el select de disciplina
const disciplinaSelect = await driver.wait(
until.elementLocated(By.id('discipline-select')),
5000
);

//crear el objeto select
const selectDisciplina = new Select(disciplinaSelect);

//elegimos una opcion de texto visible
await selectDisciplina.selectByVisibleText('bochas');

//Cargamos el input de categorias
const categorySelect= await driver.findElement(By.id('category-select'));
const selectCategory= new Select(categorySelect);
await selectCategory.selectByVisibleText('señior');

//hacemos click en el boton inscripcion
const btnInscription= await driver.findElement(By.xpath("//button[contains(text(),'Inscribir')]"))
await btnInscription.click();
console.log('Se hizo click en el boton inscribir');

/*Al realizar el click si la disciplina ya esta carga no arroja error porque poruqe no estoy verificando 
si el mensaje de error aparece, solo estoy verificando que se haga clik en el boton y luego busco la disciplina 
y como la misma nunca se elimino sigue registrada y el test corre bien.*/
/* Para verificar el mensaje de error lo haremos en el archivo BajaDisciplina*/

//busco el boton cancelar para volver y verificar que se haya inscrito
let btnCancelar = await driver.findElement(By.xpath("//button[contains(text(),'Cancelar')]"));
await btnCancelar.click();
console.log("Presionamos cancelar y volvemos a la pagina anterior")

//buscamos que la disciplina y la categoria figuren en el listado
/*
let elmenetP = await driver.findElement(By.xpath("//p[contains(text(),'bochas')]"));
if(elmenetP){
    console.log("Se encontro registrada la disciplina, ", elmenetP)
}else{
    console.log("No se registro la disciplina")
};*/
const disciplinaRegistrada = await driver.wait(
  until.elementLocated(By.xpath("//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚ','abcdefghijklmnopqrstuvwxyzáéíóú'),'bochas')]")),
  10000
);
const texto = await disciplinaRegistrada.getText();

if (texto.toLowerCase().includes('bochas')) {
  console.log("✅ La disciplina 'bochas' figura registrada correctamente");
} else {
  console.log("⚠️ La disciplina 'bochas' no figura en el texto:", texto);
}

}catch(error){
    console.error("Error durante el test:",error);
}finally{
    await driver.quit();
}
})();