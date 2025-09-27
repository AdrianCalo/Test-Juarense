/*Este metodo mostrara el testeo realizado "happy path" para acceder a la creacion de grupos
 y crear un grupo exitosamente */

//importo la url desde variables.js
const BaseUrl=require("./variableURL");
const {until, Builder, By}= require("selenium-webdriver");
const chrome= require("selenium-webdriver/chrome");

/*NOTA: Asegurarse de que el navegador Brave esté instalado en la ruta especificada
Los datos a completar se deben cambiar: Email y dni ya que el scrip verifica que no se repitan. ademas
el usuario que se use para loguearse no debe tener un grupo familiar creado, de lo contrario falla el test.
*/



(async function testCreateGroup(){
//ruta al ejecutable de brave 
const bravePath="C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe"
//configuracion de Chome para limpiar Logs
//Desactivamos servicios de Chrome para evitar errores

let options = new chrome.Options();
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
        await inputEmail.sendKeys("z@gmail.com");
    
        //esperamos que aparezca el campo imput y lo completamos
        let inputPass= await driver.wait(
            until.elementLocated(By.id("password")),
            5000
        );
        await inputPass.sendKeys("pass");   
        console.log("se completo el formulario");

//buscamos el boton por texto y ahcemos click
let btnIngresar = await driver.findElement(
    By.xpath("//button[contains(text(),'Ingresar')] ")
);
await btnIngresar.click();
console.log("se presiono el boton ingresar");

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

console.log("************ ACCEDIMOS A GESTION DE GRUPO *****");

//Buscamos y presionamos el link "Grupo Familiar"

//Buscamos el link Grupo Familiar
let grupoFamiliar_link= await driver.findElement(By.linkText("Grupo Familiar"));
await grupoFamiliar_link.click();
console.log("se hizo click en el link 'Grupo Familiar'");

//verificamos que aparezca el titulo de la pagina y haya cambiado la url
let titleGroup= await driver.wait(
    until.elementLocated(
        By.xpath("//h1[contains(text(),'Gestión de Grupo Familiar')]")       
    ),5000
);
console.log("Titulo de la pagina:", await titleGroup.getText());


//verificamos que la url haya cambiado
let urlGroup= await driver.getCurrentUrl();
if( urlGroup === `${BaseUrl}/group`){
    console.log("Redirección a Grupo Familiar correcta ✅");
} else {
console.log("Redirección incorrecta ❌"); 
}   
console.log("URL actual:", urlGroup);


/*Nota para esta parte del test no se debe tener un grupo creado, de lo contario falla el test. */
console.log("************ CREACION DE GRUPO FAMILIAR ************");

let Formulary = await driver.wait(
    until.elementLocated(By.xpath("//h3[contains(text(),'Crear Grupo Familiar')]")),
    5000
);
console.log("Formulario de creacion de grupo familiar encontrado:", await Formulary.getText());

//Cargamos el nombre del grupo en el imput.
let inputGroupName = await driver.findElement(By.xpath("//input[@type='text' and @placeholder='Ej: Familia García']"));
    await inputGroupName.sendKeys("Grupo GULADEV'S");
    console.log("Se completo el nombre del grupo con 'GulaDev's'");
    
//Buscamos el boton por texto y hacemos click
let btnCreateGroup = await driver.findElement(
    By.xpath("//button[contains(text(),'Crear Grupo Familiar')]")
);
await btnCreateGroup.click();
console.log("se presiono el boton 'Crear Grupo Familiar'");

//Esperamos que se carge el formulario para agregar a un familar
let inputName = await driver.wait(
    until.elementLocated(By.xpath("//input[@type='text' and @name='name']")),
)
    await inputName.sendKeys("Familiar1");
    console.log("Se completo el nombre del familiar con 'Familiar1'");  

let inputLastname = await driver.findElement(By.xpath("//input[@type='text' and @name='lastname']"));
    await inputLastname.sendKeys("Apellido1");
    console.log("Se completo el apellido del familiar con 'Apellido1'");    

let inputDni = await driver.findElement(By.xpath("//input[@type='text' and @name='dni']"));
    await inputDni.sendKeys("12345669");

let inputBirthdate = await driver.findElement(By.xpath("//input[@type='date' and @name='birthdate']"));
    await inputBirthdate.sendKeys("10/05/1990");
    console.log("Se completo la fecha de nacimiento del familiar con '10/05/1990'"); 

console.log("Se completaron todos los campos");

//Buscamos el boton "añadir miembro" por texto y hacemos click
let btnAddMember= await driver.findElement(
    By.xpath("//button[contains(text(),'Añadir Miembro')]")
);
await btnAddMember.click();
console.log("Se presiono el boton 'Añadir Miembro'");

//esperamos el mensaje de exito
const mensajeExito= await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'¡Miembro familiar añadido con éxito!')]")),
    10000);
    console.log("mensaje mostrado:", await mensajeExito.getText());

//esperamos que aparezca el contenedor con los datos del "Miembros adherido"
let tagDiv= await driver.wait(
    until.elementLocated(By.xpath(
        "//div[contains(text(),'Familiar1') and contains(text(),'Apellido1') and contains(text(),'12345669') and contains(text(),'10/05/1990')]")),
    5000
);
console.log("Contenedor de 'Miembros adherido' mostrado:", await tagDiv.getText());

}catch(error){
        console.error("Error durante el test:", error);
    }finally{
        await driver.quit();
    }       
})();