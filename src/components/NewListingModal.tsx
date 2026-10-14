import React, { useState } from 'react';
import { X, Upload, Utensils, HeartHandshake } from 'lucide-react';
import { Category, FoodListing, NeighborhoodLocation, PosterType, PostType } from '../types';

interface NewListingModalProps {
  currentLocation: NeighborhoodLocation;
  currentUserProfile?: import('../types').UserProfile | null;
  onClose: () => void;
  onSubmit: (listing: FoodListing) => void;
}

const PRESET_PHOTOS = [
  { label: 'Thali Meal (Roti, Dal, Paneer)', url: '/src/assets/images/food_indian_thali_curry_1791996426106.jpg' },
  { label: 'Tiffin (Idli, Vada, Chutney)', url: '/src/assets/images/food_indian_tiffin_idli_1791996426501.jpg' },
  { label: 'Hot Samosas & Mithai', url: '/src/assets/images/food_indian_samosa_mithai_1791996427184.jpg' },
  { label: 'Mandi Sabzi Basket', url: '/src/assets/images/food_indian_mandi_vegetables_1791996428278.jpg' },
];

export const NewListingModal: React.FC<NewListingModalProps> = ({
  currentLocation,
  currentUserProfile,
  onClose,
  onSubmit,
}) => {
  const [postType, setPostType] = useState<PostType>('surplus');
  const [posterType, setPosterType] = useState<PosterType>(currentUserProfile?.accountType || 'resident');
  const [posterName, setPosterName] = useState(currentUserProfile?.name || '');
  const [posterRole, setPosterRole] = useState(currentUserProfile?.locality || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Home Cooked Meals');
  const [priceType, setPriceType] = useState<'free' | 'discount'>('free');
  const [discountPrice, setDiscountPrice] = useState('40');
  const [originalPrice, setOriginalPrice] = useState('120');
  const [quantity, setQuantity] = useState('3');
  const [unit, setUnit] = useState('portions');
  const [pickupWindow, setPickupWindow] = useState('Tonight 8:00 PM – 9:30 PM');
  const [locationName, setLocationName] = useState(
    currentUserProfile?.locality
      ? `${currentUserProfile.locality}`
      : `Opposite Temple Gate, 12th Main, ${currentLocation.name}`
  );
  const [storageInfo, setStorageInfo] = useState('Consume hot tonight');
  const [urgency, setUrgency] = useState<'Immediate' | 'Today' | 'Flexible'>('Today');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(PRESET_PHOTOS[0].url);
  const [selectedDietary, setSelectedDietary] = useState<string[]>(['Pure Veg']);
  const [bringDabba, setBringDabba] = useState(currentUserProfile?.bringDabbaDefault ?? true);

  const toggleDietary = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const latOffset = (Math.random() - 0.5) * 0.005;
    const lngOffset = (Math.random() - 0.5) * 0.005;

    const qtyNum = parseInt(quantity, 10) || 1;
    const numericPrice = priceType === 'free' || postType === 'request' ? 0 : parseFloat(discountPrice) || 0;
    const numericOriginal = priceType === 'discount' && originalPrice ? parseFloat(originalPrice) : undefined;

    const newListing: FoodListing = {
      id: `item-${Date.now()}`,
      type: postType,
      title: title.trim(),
      description: description.trim(),
      posterType,
      posterName: posterName.trim() || (posterType === 'restaurant' ? 'Local Eatery' : 'Local Neighbor'),
      posterRole: posterRole.trim() || (posterType === 'restaurant' ? 'Kitchen Lead' : 'Neighbor'),
      verifiedBusiness: ['restaurant', 'mess', 'darshini', 'sweetstall'].includes(posterType),
      price: numericPrice,
      originalPrice: numericOriginal,
      category,
      quantity: `${qtyNum} ${unit}`,
      quantityRemaining: qtyNum,
      initialQuantity: qtyNum,
      unit,
      imageUrl: postType === 'surplus' ? selectedPhoto : undefined,
      coordinates: {
        lat: currentLocation.coordinates.lat + latOffset,
        lng: currentLocation.coordinates.lng + lngOffset,
      },
      locationName: locationName.trim(),
      pickupWindow: pickupWindow.trim(),
      expiresAt: new Date(Date.now() + 4 * 3600000).toISOString(),
      dietaryTags: selectedDietary,
      storageInfo,
      createdAt: new Date().toISOString(),
      claimedCount: 0,
      urgency: postType === 'request' ? urgency : undefined,
      bringDabbaRecommended: bringDabba,
    };

    onSubmit(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {postType === 'surplus' ? 'Post Surplus Food or Tiffin' : 'Post Item Request to Neighbors'}
            </h3>
            <p className="text-xs text-slate-500">
              Instantly visible within 1 km radius in {currentLocation.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Post Type Switch */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Posting Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPostType('surplus')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  postType === 'surplus'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Share Surplus Food (Free / Discounted)</span>
              </button>
              <button
                type="button"
                onClick={() => setPostType('request')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  postType === 'request'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Request Food / Ration (Need)</span>
              </button>
            </div>
          </div>

          {/* Poster info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                You Are
              </label>
              <select
                value={posterType}
                onChange={(e) => setPosterType(e.target.value as PosterType)}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
              >
                <option value="resident">Neighbor / Resident</option>
                <option value="mess">Bhojanalaya / Mess / Kitchen</option>
                <option value="darshini">Darshini / Udupi Cafe</option>
                <option value="restaurant">Restaurant / Dhaba</option>
                <option value="sweetstall">Mithai & Sweet Shop</option>
                <option value="mandi">Sabzi Mandi / Farm Stall</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name / Stall Name
              </label>
              <input
                type="text"
                required
                placeholder={posterType === 'resident' ? 'e.g. Meenakshi S.' : 'e.g. Sri Krishna Mess'}
                value={posterName}
                onChange={(e) => setPosterName(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Locality / Landmark
              </label>
              <input
                type="text"
                placeholder={posterType === 'resident' ? 'e.g. 4th Cross, Indiranagar' : 'e.g. Near Metro Station'}
                value={posterRole}
                onChange={(e) => setPosterRole(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Listing Title
              </label>
              <input
                type="text"
                required
                placeholder={
                  postType === 'surplus'
                    ? 'e.g. 5 Tawa Phulkas & Dal Tadka or Fresh Thatte Idlis'
                    : 'e.g. In need of 1 packet cow milk or 1 kg toor dal'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description & Pickup Notes
              </label>
              <textarea
                rows={2}
                required
                placeholder="Details about preparation, hygiene, packaging, reason for surplus, or what you need..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Category & Pricing / Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
              >
                <option value="Home Cooked Meals">Home Cooked Meals & Thali</option>
                <option value="Tiffin & Breakfast">Tiffin & Breakfast (Idli, Dosa, Vada)</option>
                <option value="Rotis & Breads">Rotis, Parathas & Phulkas</option>
                <option value="Mandi Sabzi & Fruits">Mandi Sabzi & Fruits</option>
                <option value="Dairy & Ration">Dairy & Ration (Milk, Paneer, Dal)</option>
                <option value="Mithai & Snacks">Mithai & Snacks (Samosa, Jalebi)</option>
                <option value="Puja Prasadam">Puja Prasadam & Festive Offerings</option>
                <option value="Other">Other Community Food</option>
              </select>
            </div>

            {postType === 'surplus' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pricing (Free or Discounted in ₹)
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as 'free' | 'discount')}
                    className="text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="free">Free (₹0)</option>
                    <option value="discount">Discounted (₹)</option>
                  </select>

                  {priceType === 'discount' && (
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-xs text-slate-500">₹</span>
                        <input
                          type="number"
                          step="5"
                          min="5"
                          value={discountPrice}
                          onChange={(e) => setDiscountPrice(e.target.value)}
                          className="w-20 pl-5 pr-2 py-2 text-xs border border-slate-300 rounded-lg font-bold tabular-nums"
                          placeholder="Price"
                        />
                      </div>
                      <span className="text-xs text-slate-400">orig:</span>
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-xs text-slate-500">₹</span>
                        <input
                          type="number"
                          step="10"
                          min="10"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          className="w-20 pl-5 pr-2 py-2 text-xs border border-slate-300 rounded-lg tabular-nums"
                          placeholder="Retail"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
                >
                  <option value="Immediate">Immediate (Within 1-2 hours)</option>
                  <option value="Today">Today (Before dinner)</option>
                  <option value="Flexible">Flexible (Anytime this week)</option>
                </select>
              </div>
            )}
          </div>

          {/* Quantity & Units */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg tabular-nums font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
              <input
                type="text"
                required
                placeholder="thalis, packs, tokris, boxes"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Window</label>
              <input
                type="text"
                required
                placeholder="e.g. Tonight 7:30 PM – 9:00 PM"
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Pickup Address in Locality */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pickup Spot / Address in {currentLocation.name}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Flat 302, Sai Residency, 6th Cross or Cashier Counter at Bhojanalaya"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Photo Selection for Surplus */}
          {postType === 'surplus' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Food Photo (Choose Indian culinary preset or upload photo)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {PRESET_PHOTOS.map((photo) => (
                  <button
                    key={photo.url}
                    type="button"
                    onClick={() => setSelectedPhoto(photo.url)}
                    className={`relative rounded-lg overflow-hidden border-2 text-left cursor-pointer transition-all ${
                      selectedPhoto === photo.url
                        ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-16 object-cover"
                    />
                    <div className="p-1 bg-white text-[10px] font-medium text-slate-800 truncate">
                      {photo.label}
                    </div>
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer p-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Upload custom photo from phone camera/gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Dietary tags & Dabba option */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dietary Details
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Pure Veg', 'Jain', 'No Onion-Garlic', 'Eggetarian', 'Halal Kitchen', 'Vegan', 'Puja Prasadam'].map(
                  (tag) => {
                    const active = selectedDietary.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDietary(tag)}
                        className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                          active
                            ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Bring Dabba checkbox */}
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={bringDabba}
                onChange={(e) => setBringDabba(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span>🍱 Recommend neighbor to bring their own steel dabba / tiffin carrier / bag</span>
            </label>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer"
            >
              Publish to 1-km Community Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
