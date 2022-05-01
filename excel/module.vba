Function СКЛОНФИО(ФИО As Variant, Падеж As Variant) As Variant
Set objHTTP = CreateObject("WinHttp.WinHttpRequest.5.1")
URL = "http://localhost:3000"
objHTTP.Open "POST", URL, False
objHTTP.setRequestHeader "User-Agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)"
objHTTP.setRequestHeader "Content-type", "application/json"
JSONString = "{""fio"":""" & ФИО & Chr(34) & "," & Chr(34) & "case_fio" & Chr(34) & " :" & Chr(34) & Падеж & Chr(34) & "}"
objHTTP.send JSONString
СКЛОНФИО = objHTTP.ResponseText()
End Function