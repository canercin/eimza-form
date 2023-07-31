import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Customer} from "./info";

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})

export class InformationComponent {
  constructor(private http: HttpClient) {
  }

  async eguven(form: NgForm): Promise<void> {
    const customer = new Customer(form.value);
    const email: string = "mtndnmz78@gmail.com";
    const password: string = "123456fb"
    let response = this.http.post<any>("https://apiimza.sisteminiz.com.tr/auth/login", {
      "email": email,
      "password": password
    });
    response.subscribe((res) => {

    }, error => {
      if (error.error) {
        alert("Giriş işleminde bir hata oldu: " + error.error.error);
      }
    })
// @ts-ignore
    let responseForToken = await response.toPromise();
// @ts-ignore
    let token = responseForToken.token;
// @ts-ignore
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      })
    };
    this.http.post<any>("https://apiimza.sisteminiz.com.tr/orderCreate", customer, options)
      .subscribe((res) => {
        const errorElements = document.querySelectorAll(".error");
        errorElements.forEach(errorElement => errorElement.remove());
        alert("Egüven başvurunuz başarı ile alındı.");
      }, errors => {
        if (errors.error.error) {
          alert(errors.error.error + " \n Lütfen formu eksiksiz ve hatasız doldurunuz.")
        } else {
          alert("Lütfen formu eksiksiz ve hatasız doldurunuz.");
          const errorElements = document.querySelectorAll(".error");
          errorElements.forEach(errorElement => errorElement.remove());

          for (const error of errors.error.errors) {
            const element = document.getElementById(error.input) as HTMLInputElement;
            const errorElement = document.createElement("div");
            errorElement.classList.add("error");
            errorElement.innerText = error.message;
            element.insertAdjacentElement("afterend", errorElement);
          }
        }
      });
    form.resetForm();
  }

  eimza(form: NgForm) {
    // E-imza başvuru formundaki bilgiler alınıyor.
    const customer: Customer = new Customer(form.value);
    // İşlem yapmak için statik olarak tanımlanan email adresi.
    const companyId: string = "companyId";

    // Kimin başvuru linkine tıklandığını tespit etmek amacıyla URL'de bulunan belirteci yakalanıyor.
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const userRefId = queryParams.get('id');

    const requestData: any = {
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      tcno: customer.tcno,
      email: customer.email.trim(),
      telefon: customer.telefon.toString().slice(-10),
      serino: customer.serino.trim(),
      birth: customer.birth,
      uyruk: customer.uyruk,
      birthloc: customer.birthloc.trim(),
      secword: customer.lastName.trim(),
      pazarlamaizni: customer.pazarlamaizni,
      telefonizni: customer.telefonizni,
      epostaizni: customer.epostaizni,
      smsizni: customer.smsizni,
      teslimatadres: customer.teslimatadres.trim(),
      teslimatil: customer.teslimatil.trim(),
      teslimatilce: customer.teslimatilce.trim(),
      setYear: customer.setYear,
      message: customer.message.trim(),
      companyId: companyId,
    }

    if (userRefId) {
      requestData.userRefId = userRefId;
    }
    console.log(requestData);
    this.http.post<any>("https://apiimza.sisteminiz.com.tr/orderCreate", requestData).subscribe(
      (res) => {
        const errorElements = document.querySelectorAll(".error");
        errorElements.forEach(errorElement => errorElement.remove());
        alert("Egüven başvurunuz başarı ile alındı.");
      }, errors => {
        if (errors.error.error) {
          alert(errors.error.error + "/nLütfen formu eksiksiz ve hatasız doldurunuz.")
        } else {
          alert("Lütfen formu eksiksiz ve hatasız doldurunuz.");
          const errorElements = document.querySelectorAll(".error");
          errorElements.forEach(errorElement => errorElement.remove());

          for (const error of errors.error.errors) {
            const element = document.getElementById(error.input) as HTMLInputElement;
            const errorElement = document.createElement("div");
            errorElement.classList.add("error");
            errorElement.innerText = error.message;
            element.insertAdjacentElement("afterend", errorElement);
          }
        }
      }
    )
    form.resetForm();
  }
}
