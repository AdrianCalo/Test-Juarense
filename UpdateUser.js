const { Builder, By, until } = require("selenium-webdriver");

//Testeo de form Actualizar datos
(async function testForm(){
    let driver = await new Builder().forBrowser("chrome").build();

    try{
    // Abrir tu página
    await driver.get("http://localhost:3000");

    // Esperar a que aparezca el input de email
    let inputEmail = await driver.wait(
      until.elementLocated(By.id("email")),
      5000
    );
    await inputEmail.sendKeys("elvigigato@hotmail.com");

    // Esperar a que aparezca el input de password
    let inputPassword = await driver.wait(
      until.elementLocated(By.id("password")),
      5000
    );
    await inputPassword.sendKeys("pass");

    // Buscar el botón por texto y hacer click
    let botonIngresar = await driver.findElement(
      By.xpath("//button[contains(text(),'Ingresar')]")
    );
    await botonIngresar.click();

    console.log("✅ Test ejecutado: se completó el formulario y se hizo click en 'Ingresar'");
    
    //hago un clic en "actualizar datos"
    actualizar_link= await driver.findElement(By.linkText("Actualizar Datos"))
    actualizar_link.click()

    //espero que aparesca el formulario de actualizar datos
    let title= await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(),'Actualizar Perfil')]")),
        5000
    )
    console.log("Aparece en pantalla form con nombre",await title.getText());

    //buscar input y completarlos 
    await driver.findElement(By.id("name")).sendKeys("testDriver");
    await driver.findElement(By.id("lastname")).sendKeys("Apellido");
    await driver.findElement(By.id("phone")).sendKeys("2281572898");
    await driver.findElement(By.id("dni")).sendKeys("35411853");
    await driver.findElement(By.id("address")).sendKeys("av. falsa 123");
    await driver.findElement(By.id("cuit")).sendKeys("20.35411853.0");
    await driver.findElement(By.id("cbu")).sendKeys("01406361256489454569832");
    
    //click en boton guardar
    const BtnGuardar= await driver.findElement(By.xpath("//button[text()='Guardar']"));
    await BtnGuardar.click();//espero que el click termine

 //verifico el resultado(ejempolo mensaje de exito)
 //como no se el id del mensaje de exito lo hago por texto qeu contiene.
 const mensajeExito= await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'¡Datos actualizados!')]")),5000);
    console.log("mensaje mostrado:",await mensajeExito.getText());

}catch(error){
    console.log('test actualizar datos fallo',error);
}finally{
    await driver.quit();
}});