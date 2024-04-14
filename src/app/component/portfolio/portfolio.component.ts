import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from 'src/app/environment';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  title = 'ACPortfolio';
  commentForm!: FormGroup;
  contactForm!: FormGroup;
  getDataComment: any;
  showAllComments: boolean = false;
  @ViewChild('navbarToggleBtn') navbarToggleBtn!: ElementRef;
  isSubmittingComment: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  toggleAllComments() {
    this.showAllComments = !this.showAllComments;
  }

  getReviewLinkText(): string {
    return this.showAllComments ? 'Close Reviews' : 'View All Reviews';
  }

  toggleNavbar() {
    if (this.navbarToggleBtn && this.navbarToggleBtn.nativeElement) {
      this.navbarToggleBtn.nativeElement.click();
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          const element = document.querySelector(`#${tree.fragment}`);
          if (element) {
            const yOffset = -60;
            const y =
              element.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }
    });

    this.commentForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3)]],
      Message: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.contactForm = this.formBuilder.group({
      ContactName: ['', [Validators.required, Validators.minLength(3)]],
      ContactMessage: ['', [Validators.required, Validators.minLength(5)]],
      ContactNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
    });

    this.getData();
    window.addEventListener('scroll', this.handleScroll);
 
  }

  contactSubmit() {
    if (this.contactForm.valid && !this.isSubmittingComment) {
      this.isSubmittingComment = true;
      const formData = this.contactForm.value;
      const id = Math.floor(Math.random() * 1000);
      const datetime = new Date();
      const timestamp = datetime.toISOString();
      const dataToSend = {
        id: id,
        Name: formData.ContactName,
        Message: formData.ContactMessage,
        PhoneNumber: formData.ContactNumber,
        timestamp: timestamp,
      };

      const api = `${environment.apiUrl}/mdata`;
      console.log(this.contactForm.value);
      this.http.post(api, dataToSend).subscribe(
        (response) => {
          this.contactForm.reset();
          alert("Thank you! Your message has been successfully submitted. We'll get back to you shortly.")
          this.isSubmittingComment = false;
        },
        (error) => {
          this.contactForm.reset();
         alert("Thank you! Your message has been successfully submitted. We'll get back to you shortly.")
          this.isSubmittingComment = false;
        }
      );
    }
  }

  onSubmit(): void {
    if (this.commentForm.valid && !this.isSubmittingComment) {
      this.isSubmittingComment = true;
      const formData = this.commentForm.value;
      const id = Math.floor(Math.random() * 1000);
      const datetime = new Date();
      const timestamp = datetime.toISOString();
      const dataToSend = {
        id: id,
        Name: formData.Name,
        Message: formData.Message,
        timestamp: timestamp,
      };

      const api = `${environment.apiUrl}/data`;

      this.http.post(api, dataToSend).subscribe(
        (response) => {
          this.commentForm.reset();
         alert("Thank you!")
          this.getData();
          this.isSubmittingComment = false;
        },
        (error) => {
          this.commentForm.reset();
         alert("Thank you!")
          this.isSubmittingComment = false;
        }
      );
    }
  }

  activeLink: string = 'home';

  setActiveLink(link: string) {
    this.activeLink = link;
  }

  getData() {
    const api = `${environment.apiUrl}/data`;

    this.http.get(api).subscribe((res) => {
      this.getDataComment = res;
      console.log(res);
    });
  }

  downloadResume() {
    const resumeUrl = 'assets/Ashish_Chauhan_Resume.pdf';
    const a = document.createElement('a');
    a.href = resumeUrl;
    a.download = 'Ashish_Chauhan_Resume.pdf';
    document.body.appendChild(a);
    a.click();
  }

  handleScroll() {
    const scrollToTopBtn = document.querySelector('.top');

    if (scrollToTopBtn) {
      if (window.scrollY > 100) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}



