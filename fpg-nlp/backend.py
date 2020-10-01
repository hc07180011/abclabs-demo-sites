import os, math, json, time, codecs, logging, pymongo, heapq
import pandas as pd
import numpy as np
from datetime import datetime
from flask import Flask, jsonify, request,redirect, url_for
from flask_cors import CORS
from bert_serving.client import BertClient


def Cosine_similarity(u, v ,s):
    return np.multiply(np.divide(np.inner(u, v), np.sqrt(np.multiply(np.sum(np.multiply(u, u), axis=1) , np.inner(v, v)))),s)

def update_page(padding_range,collections,sorted_heap):
    global db_collections
    if len(sorted_heap) < padding_range:
        return
    for _ in range(padding_range):
        idx = sorted_heap[-1]
        del sorted_heap[-1]
        collections['date'].append(db_collections['date'][idx])
        collections['title'].append(db_collections['title'][idx])
        collections['content'].append(db_collections['content'][idx])
        collections['cato'].append(db_collections['cato'][idx])
        collections['link'].append(db_collections['link'][idx])
        collections['sim'].append(db_collections['sim'][idx])
    return collections

def search(keyword,num,lamb=1.0):
    global cuda_processing_array
    global db_collections
    sign = []
    for idx, content in enumerate(db_collections['content']):
        sign.append(lamb if keyword in content else 1.0)
    print('Searching...')
    keyword_vec = bc.encode([keyword])
    scores = Cosine_similarity(cuda_processing_array, np.array(keyword_vec).reshape(-1),np.array(sign))
    db_collections['sim'] = np.around(scores, 3).tolist()
    sorted_heap = np.argsort(scores).tolist()
    scores = scores.tolist()
    collections = {'date': [], 'title': [], 'content': [], 'cato': [], 'link': [], 'sim': [],}
    collections = update_page(num*10,collections,sorted_heap)
    pages_df_heap = pd.DataFrame(collections)
    pages = pages_df_heap.sort_values('sim', ascending=False)
    print('Ok!')
    page = pages.values.tolist()[(num-1)*10:num*10]
    return page

def search_withkey(keyword,num, lamb=1.0):
    global cuda_processing_array
    global db_collections
    keyword=keyword.split('$$')
    sign = []
    for idx, content in enumerate(db_collections['content']):
        sign.append(lamb if keyword[1] in content else 0.0)
    print('Searching...')
    keyword_vec = bc.encode([keyword[0]])
    scores = Cosine_similarity(cuda_processing_array,np.array(keyword_vec).reshape(-1),np.array(sign))
    db_collections['sim'] = np.around(scores, 3).tolist()
    sorted_heap = np.argsort(scores).tolist()
    scores = scores.tolist()
    collections = {'date': [], 'title': [], 'content': [], 'cato': [], 'link': [], 'sim': [],}
    collections = update_page(num*10,collections,sorted_heap)
    pages_df_heap = pd.DataFrame(collections)
    pages = pages_df_heap.sort_values('sim', ascending=False)
    print('Ok!')
    page = pages.values.tolist()[(num-1)*10:num*10]
    return page

def getpage(num,keyword):
    global pages
    num = int(num)
    idx = (num << 3) + (num << 1)
    print(idx, len(pages))
    if len(pages) < idx:
        global collections
        update_page(idx - len(pages))
        pages = pd.DataFrame(collections)
    page = pages.values.tolist()[idx - 10 : idx]
    for p in page:
        if keyword in p[2]:
            p[1] = p[1]
    return page

def preprocess(mongoUrl='mongodb://localhost:27017/'):
    print('Connecting to BERT server...', end='')
    bc = BertClient(check_length=True)
    print(' Ok!')
    print('Connecting to DB server...', end='')
    myclient = pymongo.MongoClient(mongoUrl)
    mydb = myclient["mydb"]
    mycol = mydb["news_db"]
    all_doc = mycol.find()
    print(' Ok!')
    print('Parsing data...')
    global db_collections
    db_collections = {'_id': [], 'date': [], 'title': [], 'content': [], 'cato': [], 'link': [], 'vec': [], 'sim': []}
    cnt = all_doc.count()
    for idx, doc in enumerate(all_doc):
        print("Preprocessing: {}/{}...".format(idx, cnt), end='\r')
        db_collections['_id'].append(doc['_id'])
        db_collections['date'].append(doc['date'])
        db_collections['title'].append(doc['title'])
        db_collections['content'].append(doc['content'])
        db_collections['cato'].append(doc['cato'])
        db_collections['link'].append(doc['link'])
        db_collections['vec'].append(doc['vec'][0])
    global cuda_processing_array
    cuda_processing_array = np.array(db_collections['vec'])
    print('OK!')
    myclient.close()
    return bc

global pages
global collections
global db_collections
global cuda_processing_array
global sorted_heap
if __name__ == '__main__':
    bc = preprocess()
    
    app = Flask(__name__)
    CORS(app)

    @app.route('/search', methods=['POST'])
    def upload_keyword():
        if request.method == 'POST':
            start = time.time()
            keyword = request.values.get('keyword')
            page_num = request.values.get('page')
            k = keyword.split('$$')
            if len(k)==1:
                data = search(keyword,int(page_num))
                print('search')
            else:
                data = search_withkey(keyword,int(page_num))
                print('search_withkey')
            print(time.strftime('Search OK! Takes: {} seconds.'.format(time.time() - start)))
            return jsonify({'state': 'true', 'data': data, 'time': (time.time() - start)})
        else:
            return jsonify({'state': 'false'})

    @app.route('/page', methods=['POST'])
    def get_page():
        if request.method == 'POST':
            page_num = request.values.get('page')
            keyword = request.values.get('keyword')
            data = search_test(keyword,int(page_num))
            return jsonify({'upstate':'true','data':data})
        else:
            return jsonify({'upstate':'false'})

    app.run(host='0.0.0.0',port=5000)
