import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on('console', lambda msg: print(f'CONSOLE: {msg.text}'))
        page.on('pageerror', lambda exc: print(f'ERROR: {exc}'))
        
        print("Navigating to http://localhost:8000/")
        try:
            await page.goto('http://localhost:8000/', timeout=10000)
            await asyncio.sleep(5)  # Wait for Babel to compile
            
            root_content = await page.evaluate('document.getElementById("root").innerHTML')
            print("ROOT INNER HTML:", root_content)
            
            # Check script status
            scripts = await page.evaluate('''() => {
                return Array.from(document.scripts).map(s => ({
                    src: s.src,
                    type: s.type,
                    innerHTML: s.innerHTML.length
                }));
            }''')
            print("SCRIPTS:", scripts)
            
        except Exception as e:
            print("FAILED TO LOAD:", e)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
