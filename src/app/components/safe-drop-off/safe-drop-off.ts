import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { CampusService } from '../../services/campus.service';

interface DropOffRule {
  readonly icon: 'park' | 'stop' | 'pavement' | 'neighbours';
  readonly title: string;
  readonly titleUr: string;
  readonly body: string;
  readonly bodyUr: string;
}

/** Safe drop-off and collection guidance for parents at Markaz Deen-e-Islam, with the video. */
@Component({
  selector: 'app-safe-drop-off',
  imports: [RouterLink],
  templateUrl: './safe-drop-off.html',
})
export class SafeDropOff implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly org = ORGANIZATION;

  protected readonly videoSrc = '/videos/safe-drop-off/safe-drop-off-parents-720p.mp4';
  protected readonly posterSrc = '/videos/safe-drop-off/poster.jpg';
  protected readonly videoLength = '2:40';

  protected readonly campus = computed(() => this.campusService.byId('peterborough'));
  protected readonly addressLine = computed(
    () => this.campus()?.addressLine ?? '103 Burmer Road, Peterborough PE1 3HT',
  );
  protected readonly directionsHref = computed(
    () =>
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `Markaz Deen-e-Islam, ${this.addressLine()}`,
      )}`,
  );
  protected readonly shareHref = computed(() => {
    const text = this.i18n.pick(
      'Assalamu alaikum. Please watch this short video from MDI (Markaz-e-Deen-e-Islam) on safe drop-off and collection, and follow the four rules so our children stay safe:',
      'السلام علیکم۔ براہِ کرم مرکز دینِ اسلام کی یہ مختصر ویڈیو دیکھیں اور بچوں کی حفاظت کے لیے چار اصولوں پر عمل کریں:',
    );
    return `https://wa.me/?text=${encodeURIComponent(`${text}\nhttps://www.naginasocialwelfare.co.uk/safe-drop-off/`)}`;
  });

  protected readonly rules: readonly DropOffRule[] = [
    {
      icon: 'park',
      title: 'Park legally',
      titleUr: 'قانونی جگہ پر پارک کریں',
      body: 'Use a proper parking space nearby and walk your child to the door.',
      bodyUr: 'قریب کسی مناسب پارکنگ جگہ پر گاڑی کھڑی کریں اور بچے کو پیدل دروازے تک لے جائیں۔',
    },
    {
      icon: 'stop',
      title: 'Never stop unsafely',
      titleUr: 'غیر محفوظ جگہ پر کبھی نہ رکیں',
      body: 'Do not stop in the middle of the road, on corners, on yellow lines, at bus stops or across driveways, not even for a moment.',
      bodyUr: 'سڑک کے بیچ، موڑ پر، پیلی لکیروں پر، بس اسٹاپ پر یا کسی کے ڈرائیو وے کے سامنے ہرگز نہ رکیں، ایک لمحے کے لیے بھی نہیں۔',
    },
    {
      icon: 'pavement',
      title: 'Use the pavement side',
      titleUr: 'فٹ پاتھ کی طرف سے اتاریں',
      body: 'Let children out on the pavement side of the car, hold younger children’s hands, arrive a few minutes early and collect your child on time.',
      bodyUr: 'بچوں کو گاڑی کی فٹ پاتھ والی طرف سے اتاریں، چھوٹے بچوں کا ہاتھ پکڑیں، چند منٹ پہلے پہنچیں اور وقت پر بچے کو لے جائیں۔',
    },
    {
      icon: 'neighbours',
      title: 'Respect our neighbours',
      titleUr: 'پڑوسیوں کا احترام کریں',
      body: 'Keep driveways clear, switch off your engine while waiting, and avoid using your horn or gathering noisily in the street.',
      bodyUr: 'ڈرائیو وے خالی رکھیں، انتظار کے دوران انجن بند کریں، اور ہارن بجانے یا گلی میں شور کرنے سے گریز کریں۔',
    },
  ];

  ngOnInit(): void {
    void this.campusService.load();
  }
}
