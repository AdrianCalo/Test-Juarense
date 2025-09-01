const { Builder, By, until } = require("selenium-webdriver");

(async function testLogin() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
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


  // Esperar a que la URL contenga "/profile"
await driver.wait(until.urlContains("/profile"), 5000);

let currentUrl = await driver.getCurrentUrl();
console.log("URL actual:", currentUrl);

// Validar que sea la correcta
if (currentUrl === "http://localhost:3000/profile") {
  console.log("Redirección correcta ✅");
} else {
  console.log("Redirección incorrecta ❌");
}

  } catch (error) {
    console.error("❌ Error en el test:", error);
  } finally {
    await driver.quit();
  }

})();
