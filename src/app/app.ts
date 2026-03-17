import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/shared/toast/toast';
import { Navbar } from './components/shared/navbar/navbar';
import { LocationService } from './services/location.service';
import { AuthService } from './services/auth';

import { LocationPopupComponent } from './components/shared/location-popup/location-popup';
import { ThemeService } from './services/theme.service';
import { ChatBotComponent } from './components/shared/chat-bot/chat-bot.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, ReactiveFormsModule, CommonModule, ToastComponent, Navbar, LocationPopupComponent, ChatBotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('revshop-app');

  showLocationPopup = computed(() => {
    // Check if buyer/seller is logged in via signal, OR if shipper is in localStorage
    const isLoggedIn = !!this.authService.authState().token || !!localStorage.getItem('shipperId');
    // Only show popup IF logged in AND no location is currently selected AND not dismissed
    return isLoggedIn && !this.locationService.selectedLocation() && !this.locationService.isPopupDismissed();
  });

  constructor(
    public locationService: LocationService,
    public authService: AuthService,
    private themeService: ThemeService
  ) { }
}
