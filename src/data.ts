/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CareServicePlan, LongTermPlan } from './types';

export const BASIC_PLANS: CareServicePlan[] = [
  {
    id: 'baby-massage-monthly',
    name: 'Baby Massage Monthly Plan',
    price: 11999,
    durationLabel: 'month',
    description: 'Nurturing growth and sound sleep through safe daily home infant care.',
    features: [
      'Daily 30-minute expert baby massage',
      'Warm gentle baby bath after massage',
      'Gentle post-bath towel drying included',
      'Certified, experienced female specialist',
      'Usage of pure herbal & cold-pressed oils',
      'Flexible pausing up to 5 days'
    ]
  },
  
    id: 'mother-recovery-monthly',
    name: 'Mother Relaxing Care Plan',
    price: 13999,
    durationLabel: 'month',
    description: 'Supporting recovery, relaxation, and muscle comforting for new mothers.',
    features: [
      'Daily 30–45 min comforting recovery massage',
      'Trained female recovery specialist',
      'Custom relaxation and body tension release',
      'Gentle, comforting care following your delivery',
      'Comfort-centered pressure adjustments',
      'Pause anytime for checkups or travel events'
    ]
  },
  {
    id: 'care-bundle-monthly',
    name: 'Care Bundle (Complete Care)',
    price: 21999,
    durationLabel: 'month',
    description: 'Our most-beloved, complete Mother + Baby wellness and healing experience.',
    features: [
      'Combined mother & baby daily massages',
      'Coordinated wellness visits for both of you',
      'Dedicated caregiver ensures consistent, familiar care',
      'Gentle, clean warm bath for the newborn',
      'Promotes soothing post-delivery rest & sweet baby bonding',
      'Highly customizable daily routines',
      'Flexible pause up to 10 days'
    ],
    recommended: true
  }
];

export const LONG_TERM_PLANS: LongTermPlan[] = [
  {
    {
  id: 'bundle-3m',
  targetServiceId: 'bundle',
  months: 3,
  totalPrice: 54999,
  originalPrice: 65997,
  savingPercent: 17,
  features: [
    'Daily baby massage by trained female specialist',
    'Daily mother recovery massage included',
    'Gentle newborn bath included',
    'Dedicated caregiver allocation',
    'Priority therapist allocation',
    'Backup caregiver support',
    'Flexible pause up to 15 days'
  ]
},
{
    id: 'baby-3m',
    targetServiceId: 'baby',
    months: 3,
    totalPrice: 32999,
    originalPrice: 35997,
    savingPercent: 8,
    features: [
      'Daily 30-min baby massage + gentle baby bath',
      'Consistent caregiver allocation for physical comfort',
      'Pure natural oils used daily',
      'Flexible pause up to 15 days',
      'Trained female specialist guarantee'
    ]
  },
  {
    id: 'baby-6m',
    targetServiceId: 'baby',
    months: 6,
    totalPrice: 62999,
    originalPrice: 71994,
    savingPercent: 12.5,
    features: [
      'Ongoing growth & comforting touch-massage steps',
      'Includes gentle herbal wash & warm bath routine',
      'Standard priority backup specialists always ready',
      'Flexible pause up to 30 days',
      'Complete baby massage progress logs'
    ]
  },
  {
    id: 'baby-12m',
    targetServiceId: 'baby',
    months: 12,
    totalPrice: 114999,
    originalPrice: 143988,
    savingPercent: 20,
    features: [
      'Healthy milestones and long-term comfort care',
      'Thoughtful care throughout your baby\'s first year',
      'Choice of premium cold-pressed sesame or coconut oils',
      'Supported by our most experienced caregivers',
      'Unlimited pause blocks & customized timings'
    ]
  },
  {
    id: 'mother-3m',
    targetServiceId: 'mother',
    months: 3,
    totalPrice: 37999,
    originalPrice: 41997,
    savingPercent: 9.5,
    features: [
      '3-months body tension release and abdominal toning',
      'Comforting support adapted to your recovery journey',
      'Flexible scheduling prioritized for your convenience',
      'Stress reduction & muscle comforting focus',
      'Highly flexible morning or afternoon slots'
    ]
  }
];

export const NAVI_MUMBAI_AREAS = [
  'Airoli', 'Rabale', 'Ghansoli', 'Koparkhairne', 'Turbhe', 'Vashi', 
  'Sanpada', 'Jui Nagar', 'Nerul', 'Seawoods', 'CBD Belapur', 
  'Kharghar', 'Kamothe', 'Ulwe', 'Panvel', 'Mumbai'
];

export const FAQ_DATA = [
  {
    q: 'Are Infantree caregivers experienced and safe?',
    a: 'Absolutely. Your peace of mind is our highest priority. Every caregiver undergoes thorough background checks and receives extensive training in safety, cleanliness, and compassionate care.'
  },
  {
    q: 'Do you provide backup replacement support?',
    a: 'Yes, we do. If your dedicated caregiver is unavailable due to an emergency, we will promptly arrange a qualified backup so your family\'s routine is never interrupted.'
  },
  {
    q: 'Which areas of Navi Mumbai & Mumbai do you serve?',
    a: 'We proudly serve families across Airoli, Rabale, Ghansoli, Koparkhairne, Turbhe, Vashi, Sanpada, Jui Nagar, Nerul, Seawoods, CBD Belapur, Kharghar, Kamothe, Ulwe, Panvel, and Mumbai.'
  },
  {
    q: 'Is newborn massage safe and when can we begin?',
    a: 'Yes, infant touch-massage is deeply beneficial for sound sleep, healthy growth, and natural tummy comfort. We recommend starting after the baby is 14 days old (once the belly button is fully healed). Every touch is gentle, baby-friendly, and utilizes pure cold-pressed coconut or sesame oils.'
  },
  {
    q: 'How does the Trial Session work?',
    a: 'Our trial session is ₹1,299. This single visit allows you to meet your caregiver, experience our home care, and find the perfect routine for your family without any ongoing commitment.'
  },
  {
    q: 'Can we pause or shift the massage timings if we travel?',
    a: 'Yes, we understand a new mother\'s schedule can fluctuate. Our monthly programs include flexible pause settings, allowing you to easily adjust dates without losing any of your scheduled sessions.'
  }
];

export const REVIEWS = [
  {
    name: 'Bhagyalaxmi Zende',
    location: 'Vashi',
    rating: 5,
    tag: 'Mother & Baby Massage',
    date: 'May 2026',
    comment: 'The massage felt totally professional for me and for my baby ..I was comfortable at all times ,my body felt better for it ..after giving my baby this massage,she took 2 hr nap highly recommended'
  },
  {
    name: 'Khevani Brahmbhatt',
    location: 'Seawoods',
    rating: 5,
    tag: 'Post-Delivery Relief',
    date: 'May 2026',
    comment: 'Meri sister delivery ke baad kaafi pain mein thi, inki massage therapy ke baad usko honestly kaafi relief mila.'
  },
  {
    name: 'Harshada Shah',
    location: 'Ulwe',
    rating: 5,
    tag: 'Baby Massage Service',
    date: 'April 2026',
    comment: 'I had a very good experience with Infantree Mother and Baby Care. Their baby massage service was gentle, professional, and comfortable. The staff handled the baby with care and patience, which made me feel relaxed and confident. It’s a helpful service for new mothers who need proper support and guidance at home. Overall, I’m very satisfied and would recommend them.'
  },
  {
    name: 'Sohan Singh',
    location: 'Ulwe',
    rating: 4,
    tag: 'Baby & Mother Care',
    date: 'May 2026',
    comment: 'Very good care of baby and mother. My wife is appreciating the therapist. She is experienced and having good knowledge of child care. Overall good massage , recommended.'
  },
  {
    name: 'UW Sumit',
    location: 'CBD Belapur',
    rating: 5,
    tag: 'Infant Care & Massage',
    date: 'April 2026',
    comment: 'Mt spouse is really happy and found them very kind while massaging my lovely daughter. Experienced massager and therepist.'
  }
];
