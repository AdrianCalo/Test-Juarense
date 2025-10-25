/*Este test mostara el Happy path de la baja de una disciplina*/

//importo la url desde variable.js
const BaseUrl = require("./variableURL");
const { until, By, Builder, Select } = require("selenium-webdriver")

const chrome = require("selenium-webdriver/chrome");

/*Por razones de comodidad usaremos el navegador Brave ya que hemos tenido problemas 
por los popups que lanza e interfierren con la realizacion del test*/

(async function testBajaDisciplina() {
    //ruta de brave
    const bravePath = "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe";
    //configuracion de chrome para limpiar Logs
    //desactivamos servicios de Chrome para evitar errores

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

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        console.log("Iniciando el test...")
        //abrimos el navegador y mostramos el proyecto en pantalla
        await driver.get(BaseUrl);

        //esperamos que aparezcan los input del login y cargamos los datos

        let inputEmail = await driver.wait(
            until.elementLocated(By.id("email")),
            5000
        );
        await inputEmail.sendKeys("ElVigiGato@hotmail.com");

        //esperamos que aparezca el input del password
        let inputPassword = await driver.wait(
            until.elementLocated(By.id("password")),
            5000
        );
        await inputPassword.sendKeys("pass");
        console.log("Se completo el login con datos validos")

        console.log("buscamos el boton ingresar y hacemos click")

        await driver.sleep(2000)

        let btnIngresar = await driver.findElement(
            By.xpath("//button[contains(text(),'Ingresar')]")
        );
        await btnIngresar.click();
        console.log("Se presiono el boton ingresar");

        //esperamos que la url contenga "/profile" indicando que accdimos correctamente
        await driver.wait(until.urlContains("/profile"), 5000);

        //verificamos que la url haya cambiado
        let currentUrl = await driver.getCurrentUrl();
        console.log("URL actual:", currentUrl);

        //varificamos que sea correcta
        if (currentUrl === `${BaseUrl}/profile`) {
            console.log("Redirección correcta ✅");
        } else {
            console.log("Redirección incorrecta ❌");
        }
        //Debemos verificar que exista alguna disciplina 
        console.log("verificamos que exista alguna disciplina asignada al usuario")

        //Buscamos la seccion de inscripciones
        let titleInscription = await driver.wait(
            until.elementLocated(
                By.xpath("//h3[contains(text(),'Mis Inscripciones')]")
            ), 5000
        );
        if (titleInscription) {
            console.log("Se encontro la seccion de inscripciones")
        } else {
            console.log("No se encontro la seccion de inscripciones, Inscribirse a alguna disciplina antes de correr nuevamente el test.")
            await driver.quit()
        }
        /*Al buscar una disciplina para eliminar*/
        //La buscaremos por el boton "dar de baja"
        console.log("Buscamos una disciplina cualquiera para eliminar a travez del boton 'Dar de baja'");

        //buscamos la primer inscripcion disponible
        const inscripcion= await driver.findElement(By.css('li.flex.justify-between.items-center'));

        //obtenemos el nombre de la inscripcion
        const nombre = await inscripcion.findElement(By.css('p.font-semibold')).getText();

        //buscamos y ahcemos click en el boton de baja
        const btnBaja= await inscripcion.findElement(By.xpath("//button[contains(text(),'Dar de baja')]"));
        await btnBaja.click();

        console.log(`Se hizo click en el boton de Baja de la disciplina: ${nombre}`);

        /*EN CASO QUE SE CAMBIE EL ALER POR UN MENSAJE MODIFICAR ACA */ 
        //esperamos y aceptamos el alert de confirmacion
        await driver.wait(until.alertIsPresent());//espera a que aparezca el popup del anvegador
        const alert= await driver.switchTo().alert();//cambia el contexto al alert
        await alert.accept(); //o  alert.dismiss() si queres cancelar

        //esperar a que el elemento desaparezca (confirmandoq eu se borro)
        await driver.wait(until.stalenessOf(inscripcion),5000);//espera hasta que el element LI original desaparezca del DOM, confirmandoq eu fue realmente eliminado
        console.log(`✅ se dio de baja la inscripcion ${nombre} exitosamente`);


    } catch (error) {
        console.error("Error durante el test:", error)
    } finally {
        await driver.quit()
    }
})();