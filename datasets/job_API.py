import requests
import xml.etree.ElementTree as ET
import openpyxl

# API 정보
API_KEY = "xD1Kuye8pND6llJrhHe3Amgi3VPHWVXZpv6eYJUu5xPVpvD67Azl9IopP/ifbIb3/QE6sG4UAOulLOK1HHRVYA=="  # Decoded Key
BASE_URL = "http://apis.data.go.kr/B552474/SenuriService/getJobList"  # End Point

# 엑셀 파일 생성
workbook = openpyxl.Workbook()
sheet = workbook.active
sheet.title = "구인정보"
# 헤더 설정
sheet.append([
    "채용공고ID", "채용공고 제목", "기업명", "근무지명", "고용형태", "접수방법",
    "접수 시작일", "접수 종료일", "직종명", "마감여부"
])

# 페이지별 데이터 가져오기
page_no = 1
while True:
    params = {
        "serviceKey": API_KEY,  # 서비스키
        "pageNo": page_no,      # 페이지 번호
        "numOfRows": 100,       # 한 페이지 결과 수 (최대값으로 설정)
    }

    # API 호출
    response = requests.get(BASE_URL, params=params)

    if response.status_code == 200:
        # XML 데이터 파싱
        root = ET.fromstring(response.content)

        # 결과 코드 확인
        result_code = root.find("header/resultCode").text
        if result_code == "00":  # 성공 코드
            items = root.findall(".//item")
            max_pages = 10
            if page_no > max_pages:
                print('페이지 제한에 도달')
                break
            # if not items:
            #     break  # 더 이상 데이터가 없으면 종료

            # 데이터를 엑셀로 저장
            for item in items:
                sheet.append([
                    item.findtext("jobId", "N/A"),          # 채용공고ID
                    item.findtext("recrtTitle", "N/A"),     # 채용공고 제목
                    item.findtext("oranNm", "N/A"),         # 기업명
                    item.findtext("workPlcNm", "N/A"),      # 근무지명
                    item.findtext("emplymShpNm", "N/A"),    # 고용형태
                    item.findtext("acptMthd", "N/A"),       # 접수방법
                    item.findtext("frDd", "N/A"),           # 접수 시작일
                    item.findtext("toDd", "N/A"),           # 접수 종료일
                    item.findtext("jobclsNm", "N/A"),       # 직종명
                    item.findtext("deadline", "N/A"),       # 마감여부
                ])
        else:
            print(f"API 오류: {root.find('header/resultMsg').text}")
            break
    else:
        print(f"HTTP 요청 실패: {response.status_code}")
        break

    print(f"Page {page_no} 완료")
    page_no += 1

# 엑셀 파일 저장
workbook.save("구인정보목록.xlsx")
print("엑셀 파일 저장 완료: 구인정보목록.xlsx")
