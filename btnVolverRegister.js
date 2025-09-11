//improto baseUrl
const baseUrl = require('./variableURL')

const { Builder, By, until } = require("selenium-webdriver");

(async function testBtnVolver() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        //abimos la pagina
        await driver.get(baseUrl);

        //esperamos que cargue el link para acceder al registro
        let registroAqui = await driver.wait(
            until.elementLocated(By.partialLinkText("aquí")), 5000);
        await registroAqui.click();
        console.log("Se hizo click en boton 'AQUI'");

        //espero que cambie la url a /register
        await driver.wait(until.urlContains("/register"), 5000);
        console.log("Esperando que cambie la url a /register...")

        //obtenemos la url del sitio accedido
        let currentUrl = await driver.getCurrentUrl();
        console.log("URL actual:", currentUrl);

        //validamos que sea la url correcta
        if (currentUrl === `${baseUrl}/register`) {
            console.log("Redireccion correcta ✅")
        } else {
            console.log("Redireccion incorrecta ❌")
        };

        console.log("El Usuario presionara el boton VOLVER");

        //verificamos que el boton VOLVER EXISTE
        let btnVolver = await driver.findElement(By.xpath("//a[contains(text(),'Volver')]"));//buscamos el boton
        console.log("esperamos que se presione el boton Volver")
        await btnVolver.click();
        console.log("Se presiono el boton, esperamos la redireccion a home");

        //Para asegurarnos que la redireccion se hizo correctamente
        //esperamos encontrar un elemento de la pagina home/login

        let loginButton = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(),'Ingresar')]"))
            , 5000
        );

        if(loginButton){
            console.log("Pagina de login detectada correctamente✅");
        }else{
            console.log("No se detecto la pagina de login ❌");
        }

        //ahora obtenemos la url actual y la comparamos con la baseUrl
        let newCurrentUrl = await driver.getCurrentUrl();
        console.log("La nueva url despues de presionar el boton es: ", newCurrentUrl);

        //esperamos que la url vuelva a ser base(http://localhost:3000)
        await driver.wait(until.urlContains(baseUrl), 5000);

        //Creamos una funcion normalizadora para la url para eliminar barras al final
        function normalizeUrl(url) {
            return url.replace(/\/+$/, "");
        }
        if(normalizeUrl(newCurrentUrl)===normalizeUrl(baseUrl)){
            console.log("Redireccion a home correcta ✅");
        }else{
            console.log("Redireccion a home incorrecta ❌");
        }

    } catch (error) {
        console.error("❌ error en el test: ", error);
    } finally {
        await driver.quit();
    }
})();
