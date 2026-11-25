"""Run: python -m pip install playwright; python checks/verify.py (Microsoft Edge)."""
from pathlib import Path
from playwright.sync_api import sync_playwright

index = Path(__file__).resolve().parents[1] / "web" / "index.html"
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="msedge")
    page = browser.new_page(reduced_motion="reduce", viewport={"width": 1180, "height": 850})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(index.as_uri())
    assert page.locator(".tile").count() == 4
    page.click("#featured")
    page.get_by_role("button", name="흑 1번, 베팅 0칩").click()
    page.get_by_role("button", name="백 2번, 베팅 0칩").click()
    page.evaluate("rnd=()=>0")
    page.get_by_role("button", name="회전 · 20").click()
    page.wait_for_function("!live")
    assert page.evaluate("balance===1000 && historyRows[0].paid===20")
    assert page.locator(".winner").count() == 1
    assert page.evaluate("""roulettePay([{color:'흑',number:2,amount:10}],0)===15 &&
        roulettePay([{color:'백',number:1,amount:10}],0)===0""")
    page.click("#back")
    page.locator(".tile").nth(0).click()
    page.get_by_text("릴 돌리기", exact=True).click()
    page.wait_for_function("!live")
    assert page.evaluate("historyRows[0].paid===300 && balance===1290")
    page.click("#back")
    page.locator(".tile").nth(2).click()
    page.evaluate("freshDeck=()=>[4,3,2,1,0,23,22,21,20];rnd=()=>99")
    page.get_by_text("카드 받기",exact=True).click()
    page.wait_for_function("!busy")
    for _ in range(4):
        page.get_by_text("체크",exact=True).click()
        page.wait_for_function("!busy")
    assert page.evaluate("!live && board.length===5 && historyRows[0].paid===10")
    page.click("#back")
    page.locator(".tile").nth(3).click()
    page.evaluate("freshDeck=()=>[3,6,12,8,9]")
    page.get_by_text("카드 받기",exact=True).click()
    page.wait_for_function("!live")
    assert page.evaluate("historyRows[0].paid===25 && balance===1305")
    page.reload()
    assert page.evaluate("historyRows.length===4 && balance===1305")
    page.evaluate("localStorage.setItem('neonPier1.chips','1250')")
    page.click("#sound")
    assert page.evaluate("localStorage.getItem('neonPier1.chips')==='1250'")
    page.set_viewport_size({"width":390,"height":844})
    page.click("#featured")
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    assert not errors, errors
    browser.close()
print("PASS: 4 tables, payouts, ledger persistence, stale-write regression, mobile width")

