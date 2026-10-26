const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

describe("Web UI Automation Advance Part 1 - Login Scenarios", function () {
    let driver;

     // Hook: Berjalan 1x di awal sebelum semua skenario dimulai
    before(async function () {
       const options = new chrome.Options();

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
        await driver.manage().setTimeouts({ implicit: 5000 });
    });

    // Hook: Berjalan setiap kali sebelum skenario (it) dimulai
    beforeEach(async function () {
        // Navigasi ke URL utama setiap sebelum tes
        await driver.get("https://belajar-bareng.onrender.com/");

        let usernameInput = await driver.findElement(
            By.css('input[data-testid="username-input"]')
        );
        let passwordInput = await driver.findElement(
            By.css('input[data-testid="password-input"]')
        );
        let loginButton = await driver.findElement(
            By.css('button[data-testid="login-button"]')
        );

        await usernameInput.sendKeys("admin");
        await passwordInput.sendKeys("admin");
        await loginButton.click();
    });

    // Hook: Berjalan setiap kali setelah skenario (it) selesai
    afterEach(async function () {
        // Membersihkan cookies agar sesi kembali bersih
        await driver.manage().deleteAllCookies();
        console.log("Skenario selesai dijalankan.");
    });

    // Hook: Berjalan 1x di akhir setelah semua skenario selesai
    after(async function () {
        if (driver) {
            await driver.quit();
            console.log("Browser ditutup. Seluruh rangkaian test selesai.");
        }
    });

    // Skenario 1: Login Berhasil dengan Kredensial Valid
    it("Skenario 1 - Harus berhasil login dengan username dan password valid", async function () {
        let usernameInput = await driver.findElement(By.css('input[data-testid="username-input"]'));
        let passwordInput = await driver.findElement(By.css('input[data-testid="password-input"]'));
        let loginButton = await driver.findElement(By.css('button[data-testid="login-button"]'));

        await usernameInput.sendKeys("admin");
        await passwordInput.sendKeys("admin");
        await loginButton.click();

        // Verifikasi: Mencari elemen dashboard atau teks setelah sukses login
        // Menunggu hingga URL berubah atau elemen dashboard muncul
        await driver.wait(until.urlContains("dashboard"), 5000).catch(() => {});
        let currentUrl = await driver.getCurrentUrl();
        
        console.log("URL Saat ini: " + currentUrl);
    });

    // Skenario 2: Login Gagal dengan Password Salah
    it("Skenario 2 - Harus gagal login dengan password salah", async function () {
        let usernameInput = await driver.findElement(By.css('input[data-testid="username-input"]'));
        let passwordInput = await driver.findElement(By.css('input[data-testid="password-input"]'));
        let loginButton = await driver.findElement(By.css('button[data-testid="login-button"]'));

        await usernameInput.sendKeys("admin");
        await passwordInput.sendKeys("salahpassword");
        await loginButton.click();

        // Verifikasi: Tetap berada di halaman login atau muncul pesan error
        let currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, "https://belajar-bareng.onrender.com/");
    });

    // Skenario 3: Login Gagal dengan Username Kosong
    it("Skenario 3 - Harus gagal login jika field username dikosongkan", async function () {
        let passwordInput = await driver.findElement(By.css('input[data-testid="password-input"]'));
        let loginButton = await driver.findElement(By.css('button[data-testid="login-button"]'));

        await passwordInput.sendKeys("admin");
        await loginButton.click();

        // Verifikasi: Form validation memblokir navigasi
        let currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, "https://belajar-bareng.onrender.com/");
    });
});