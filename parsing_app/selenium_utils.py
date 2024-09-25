import os
from datetime import datetime, date, timedelta

import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement


class GetOutOfLoop(Exception):
    pass


def get_header(article: WebElement) -> str:

    header = article.find_element(By.XPATH, ".//div[@data-testid='card-text-wrapper']")
    header_span = header.find_element(By.XPATH, ".//h2[@data-testid='card-headline']")

    return header_span.text


def get_post_url(card: WebElement) -> str:

    a_element = card.find_element(By.XPATH, ".//a[@data-testid='internal-link']")
    url = a_element.get_attribute("href")

    return url


def get_post_data(url: str):
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")

    post_driver = webdriver.Chrome(options=chrome_options)
    post_driver.get(url)

    post_article = post_driver.find_element(By.TAG_NAME, 'article')

    # get post header
    h1 = post_article.find_element(By.TAG_NAME, 'h1')

    # get post body
    body = post_article.find_elements(By.XPATH,
                                      ".//div[@data-component='image-block' or @data-component='text-block' or @data-component='subheadline-block']")
    #body = ["\n"+e.get_attribute('outerHTML') for e in body]

    temp = []
    for e in body:
        if e.get_attribute("data-component") == "subheadline-block":
            break

        temp.append("\n"+e.get_attribute('outerHTML'))
    body = ' '.join(temp)
    
    return h1.text, body


def get_img(div: WebElement, is_preview: bool, article: WebElement) -> str:
    img_div = div

    img = img_div.find_element(By.TAG_NAME, 'img')

    url = img.get_attribute('src')

    if is_preview:
        url = img.get_attribute('data-src')
        print(url)
        url = url.replace('{width}', '624')
    else:
        url = url.replace("/480/", "/800/")

    # print(url)
    if '.webp' in url:
        url = url.replace(".webp", "")

    print("Img bbc url:", url)
    response = requests.get(url)

    header = get_header(article)
    url = url.split('.')
    img_name = ''.join(e for e in header if e.isalnum())

    with open(os.path.join(os.path.realpath('.')+"\\frontend\\public\\uploads", f"{img_name.lower()}"+"."+url[-1]), "wb") as f:
        f.write(response.content)
    return img_name.lower()+"."+url[-1]


def get_time(article: WebElement) -> datetime:
    time_spans = article.find_element(By.XPATH, ".//span[@data-testid='card-metadata-lastupdated']")

    datetime_str = time_spans.text
    datetime_str = datetime_str.split()
    print(datetime_str)
    if datetime_str[2].isdigit():
        datetime_odj = datetime.now()
        month = datetime.strptime(datetime_str[1], '%b').month
        datetime_odj = datetime_odj.replace(day=int(datetime_str[0]), month=month, year=int(datetime_str[2]))
    else:
        if "day" in datetime_str[1]:
            datetime_odj = datetime.today()
            datetime_odj = datetime_odj - timedelta(days=int(datetime_str[0]))
        if "hr" in datetime_str[1]:
            datetime_odj = datetime.today()
            datetime_odj = datetime_odj - timedelta(hours=int(datetime_str[0]))
        if "min" in datetime_str[1]:
            datetime_odj = datetime.today()
            datetime_odj = datetime_odj - timedelta(minutes=int(datetime_str[0]))

    return datetime_odj


def get_preview(article: WebElement) -> str:
    preview = article.find_element(By.XPATH, ".//p[@data-testid='card-description']")
    preview_text = preview.text
    return preview_text
