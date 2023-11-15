import os
from datetime import datetime

import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement


class GetOutOfLoop(Exception):
    pass


def get_header(article: WebElement) -> str:

    header = article.find_element(By.TAG_NAME, 'header')
    header_span = header.find_element(By.TAG_NAME, 'span')

    return header_span.text


def get_post_url(article: WebElement) -> str:

    header = article.find_element(By.TAG_NAME, 'header')
    url = header.find_element(By.TAG_NAME, "a").get_attribute("href")

    return url


def get_post_data(url: str):
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    post_driver = webdriver.Chrome(options=chrome_options)
    post_driver.get(url)

    post_article = post_driver.find_element(By.TAG_NAME, 'article')

    # get post header
    header = post_article.find_element(By.TAG_NAME, 'header')
    h1 = header.find_element(By.TAG_NAME, 'h1')

    # get post body
    body = post_article.find_elements(By.XPATH,
                                      "//div[@data-component!='links-block' and @data-component!='topic-list' and @data-component!='regionalIndexExternalLinks-disclaimer' and not(h2)]")
    body = ["\n"+e.get_attribute('outerHTML') for e in body]
    body = ' '.join(body)
    
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
        url = url.replace("/320/", "/800/")

    # print(url)
    response = requests.get(url)

    header = article.find_element(By.TAG_NAME, 'header')
    img_name = ''.join(e for e in header.text if e.isalnum())

    with open(os.path.join(os.path.realpath('.')+"\\frontend\\public\\uploads", f"{img_name.lower()}.png"), "wb") as f:
        f.write(response.content)
    return img_name.lower()+'.png'


def get_time(article: WebElement) -> datetime:
    time_div = article.find_element(By.TAG_NAME, 'div')
    time_div = time_div.find_element(By.TAG_NAME, 'time')
    time_spans = time_div.find_elements(By.TAG_NAME, 'span')

    datetime_str = time_spans[1].text
    datetime_str = datetime_str.replace(" ", "")

    try:
        year = int(datetime_str[-4:])

        # if no exception return date
        month_str = datetime_str[6:9]
        month_num = datetime.strptime(month_str, '%b').month

        datetime_str = datetime_str.replace(month_str, str(month_num))
        datetime_odj = datetime.strptime(datetime_str, "%H:%M%d%m%Y")

        return datetime_odj
    except ValueError:
        pass

    try:
        month = datetime.strptime(datetime_str[-3:], '%b').month

        # if no exception return date
        datetime_str = datetime_str.replace(datetime_str[-3:], str(month))
        datetime_str = datetime_str + str(datetime.now().year)
        datetime_odj = datetime.strptime(datetime_str, "%H:%M%d%m%Y")
        return datetime_odj
    except ValueError:
        pass

    datetime_str = datetime_str + str(datetime.now().day)
    datetime_str = datetime_str + str(datetime.now().month)
    datetime_str = datetime_str + str(datetime.now().year)
    datetime_odj = datetime.strptime(datetime_str, "%H:%M%d%m%Y")

    return datetime_odj


def get_preview(preview) -> str:
    if preview is WebElement:
        preview_text = preview.find_element(By.TAG_NAME, 'p')
        return preview_text.text
    else:
        preview_texts = preview.find_elements(By.TAG_NAME, 'p')
        preview_text = ["\n"+e.text for e in preview_texts]
        preview_text = ' '.join(preview_text)
    return preview_text
