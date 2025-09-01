const {until, Builder, By }= require("selenium-webdriver");

(async function testPanelAdmin(){
    let driver= await new Builder().forBrowser("chrome").build();

    try{
        //abrimos la pagina
        await driver.get("http://localhost:3000");

        //esperamos qeu aparescan los input del login
        let inputEmail= await driver.wait(
            until.elementLocated(By.id("email")),
            5000
        );
        await inputEmail.sendKeys("elvigigato@hotmail.com");

        //esperamos a qeu aparesca el campo password
        let inputPassword= await driver.wait(
            until.elementLocated(By.id("password")),
            5000
        );
        await inputPassword.sendKeys("pass");

        console.log("se completo el formulario");

        //buscamos el boton por texto y hacemos click
        let btnIngresar = await driver.findElement(
            By.xpath("//button[contains(text(),'Ingresar')]")
        );
        await btnIngresar.click();
        console.log("se presiono el boton ingresar");

        //esperamos que la url contenga "/profile"
        await driver.wait(until.urlContains("/profile"),5000);
        
        //verificamos que la url haya cambiado
        let currentUrl=await driver.getCurrentUrl();
        console.log("URL actual:", currentUrl);

        //validamos que sea correcta
        if(currentUrl === "http://localhost:3000/profile"){
             console.log("Redirección correcta ✅");
        } else {
        console.log("Redirección incorrecta ❌"); 
        }
        
        //buscamos y presionamos el link "Ir a Admin"
        let admin_link= await driver.findElement(By.linkText("Ir a Admin"))
        await admin_link.click();

        //verifiacmos que la URL cambie nuevamente
        //esperamos que contenga "/admin"
        await driver.wait(until.urlContains("/admin"),5000);
        //verificamos que la URL haya cambiado
        let newUrl=await driver.getCurrentUrl();
        console.log("Nueva URL:", newUrl);

        //validamos que sea correcta
        if(newUrl=== "http://localhost:3000/admin"){
            console.log("Redirección a admin correcta ✅");
        } else {
        console.log("Redirección incorrecta ❌");
        }

        //esperamos que aparesca el titulo de la nueva pagina
        //busca por etiqueta html
        let h2element= await driver.findElement(By.tagName("h2"));
        let texto= await h2element.getText();
        console.log("texto del h2:", texto);


    }catch(error){
        console.error("❌ Error en el test:", error);
    }finally{
        await driver.quit();
    }
})();