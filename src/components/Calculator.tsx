import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

const DEFAULT_MARGIN = 20
const SHIPPING_RATES_USD_PER_KG = {
  ODDIY: 10, // USD per kg
  KOLLAGEN: 13 // USD per kg
}

export function Calculator() {
  const [originalPrice, setOriginalPrice] = useState<number>(10000)
  const [weight, setWeight] = useState<number>(100)
  const [shippingType, setShippingType] = useState<'ODDIY' | 'KOLLAGEN'>('ODDIY')
  const [margin, setMargin] = useState<number>(DEFAULT_MARGIN)
  const [volume, setVolume] = useState<number>(1) // Default volume is 1
  const [exchangeRate, setExchangeRate] = useState<number>(9.5) // Default KRW to UZS rate (will be updated from API)
  const [usdToKrwRate, setUsdToKrwRate] = useState<number>(1450) // Default USD to KRW rate
  const [isPriceDetailsModalOpen, setIsPriceDetailsModalOpen] = useState(false)
  
  // Get shipping rate in USD per kg based on selected type
  const shippingRateUSDPerKg = SHIPPING_RATES_USD_PER_KG[shippingType]
  
  // Calculate total price for all volume (original price * volume)
  const totalOriginalPrice = originalPrice * volume
  
  // Calculate shipping cost: (weight in grams / 1000) * rate per kg in USD * USD to KRW rate * volume
  const shippingCost = (weight / 1000) * shippingRateUSDPerKg * usdToKrwRate * volume
  
  // Calculate total cost in KRW
  const totalCostKRW = totalOriginalPrice + shippingCost
  
  // Calculate margin amount in KRW
  const marginAmountKRW = totalCostKRW * (margin / 100)
  
  // Calculate final price with margin in KRW
  const priceWithMarginKRW = totalCostKRW + marginAmountKRW
  
  // Convert to UZS and round to nearest thousand
  const retailPriceUZS = Math.round((priceWithMarginKRW * exchangeRate) / 1000) * 1000
  
  // Calculate percentages for visualization
  const originalPricePercentage = (totalOriginalPrice / priceWithMarginKRW) * 100
  const shippingPercentage = (shippingCost / priceWithMarginKRW) * 100
  const marginPercentage = (marginAmountKRW / priceWithMarginKRW) * 100
  

  // Fetch exchange rates
  const fetchExchangeRate = useCallback(async () => {
    try {
      // Using exchangerate-api.com free tier
      // We need to calculate KRW to UZS through USD
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Get both KRW and UZS rates relative to USD
      const usdToKrw = data.rates?.KRW
      const usdToUzs = data.rates?.UZS
      
      if (!usdToKrw || !usdToUzs) {
        throw new Error('Currency rates not available')
      }
      
      // Store USD to KRW rate for shipping calculations
      setUsdToKrwRate(usdToKrw)
      
      // Calculate KRW to UZS rate (1 KRW = ? UZS)
      const krwToUzs = usdToUzs / usdToKrw
      
      setExchangeRate(krwToUzs)
      
      // Log the fetched rates for debugging
      console.log('Exchange rates updated!')
      console.log(`1 USD = ${usdToKrw.toFixed(2)} KRW`)
      console.log(`1 KRW = ${krwToUzs.toFixed(4)} UZS`)
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
      // Keep the default rates on error
    }
  }, [])

  // Fetch rate on mount
  useEffect(() => {
    fetchExchangeRate()
  }, [fetchExchangeRate])

  // Format number with thousand separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  // Haptic feedback helper
  const triggerHaptic = () => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    }
  }



  return (
    <>
      {/* Main Calculator Container */}
      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Retail Price Display at Top */}
          <div className="bg-zinc-900 dark:bg-zinc-100 p-6 relative overflow-hidden border-0">
            {/* Price Display */}
            <button 
              onClick={() => setIsPriceDetailsModalOpen(true)}
              className="w-full text-center cursor-pointer relative z-10"
            >
              <p className="text-2xl font-bold text-white dark:text-black">
                {formatNumber(retailPriceUZS)} UZS
              </p>
            </button>
          </div>

          {/* Original Price */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="original-price" className="text-lg font-medium">Narxi</Label>
              <span className="text-lg font-semibold text-primary">{formatNumber(originalPrice)} KRW</span>
            </div>
            <div className="py-2">
              <Slider
                id="original-price"
                value={[originalPrice]}
                onValueChange={(value) => {
                  setOriginalPrice(value[0])
                  triggerHaptic()
                }}
                min={500}
                max={50000}
                step={500}
                className="touch-none"
              />
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="weight" className="text-lg font-medium">Og'irligi</Label>
              <span className="text-lg font-semibold text-primary">{weight}g</span>
            </div>
            <div className="py-2">
              <Slider
                id="weight"
                value={[weight]}
                onValueChange={(value) => {
                  setWeight(value[0])
                  triggerHaptic()
                }}
                min={10}
                max={1000}
                step={10}
                className="touch-none"
              />
            </div>
          </div>

          {/* Shipping Type */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="shipping-type" className="text-lg font-medium">Pochta</Label>
              <span className="text-lg font-semibold text-primary">{shippingRateUSDPerKg} USD/kg</span>
            </div>
            <ToggleGroup 
              type="single" 
              value={shippingType}
              onValueChange={(value: string) => {
                if (value) {
                  setShippingType(value as 'ODDIY' | 'KOLLAGEN')
                  triggerHaptic()
                }
              }}
              className="grid grid-cols-2 gap-2"
            >
              <ToggleGroupItem 
                value="ODDIY" 
                aria-label="Oddiy pochta"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <div className="font-medium">Oddiy</div>
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="KOLLAGEN" 
                aria-label="Kollagen pochta"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <div className="font-medium">Kollagen</div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Volume */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-lg font-medium">Miqdor</Label>
              <span className="text-lg font-semibold text-primary">{volume} dona</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 10, 20, 50, 100].map((value) => (
                <Button
                  key={value}
                  variant={volume === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setVolume(value)
                    triggerHaptic()
                  }}
                  className="font-medium"
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          {/* Margin */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-lg font-medium">Foyda</Label>
              <span className="text-lg font-semibold text-primary">{formatNumber(marginAmountKRW)} KRW</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[10, 20, 30, 40, 50].map((value) => (
                <Button
                  key={value}
                  variant={margin === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setMargin(value)
                    triggerHaptic()
                  }}
                  className="font-medium"
                >
                  {value}%
                </Button>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Price Details Modal */}
      <Dialog open={isPriceDetailsModalOpen} onOpenChange={setIsPriceDetailsModalOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <div className="space-y-4 p-4">
            {/* Section 1: Costs (Xarajatlar) */}
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Xarajatlar</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tovar narxi</span>
                <span className="text-sm font-medium">{formatNumber(originalPrice)} KRW</span>
              </div>
              {volume > 1 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">× {volume} dona</span>
                  <span className="text-sm font-medium">{formatNumber(totalOriginalPrice)} KRW</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pochta ({shippingType.toLowerCase()})</span>
                <span className="text-sm font-medium">{formatNumber(shippingCost)} KRW</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium">Jami xarajat</span>
                <span className="text-sm font-bold">{formatNumber(totalCostKRW)} KRW</span>
              </div>
            </div>
            
            {/* Section 2: Profit (Foyda) */}
            <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">Sizning foydangiz</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-400">Foyda ({margin}%)</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">{formatNumber(marginAmountKRW)} KRW</span>
              </div>
            </div>
            
            {/* Section 3: Final Prices (Sotish narxlari) */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sotish narxlari</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Narx (KRW)</span>
                <span className="text-base font-medium">{formatNumber(priceWithMarginKRW)} KRW</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="text-base font-medium">Sotish narxi</span>
                <span className="text-xl font-bold text-primary">{formatNumber(retailPriceUZS)} UZS</span>
              </div>
              {volume > 1 && (
                <div className="flex justify-between items-center px-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Har bir dona</span>
                  <span className="text-sm font-medium">{formatNumber(Math.round(retailPriceUZS / volume / 1000) * 1000)} UZS</span>
                </div>
              )}
            </div>
            
            {/* Visual Breakdown - Simplified */}
            <div className="space-y-2">
              <div className="relative w-full h-5 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div 
                    className="bg-gray-400 transition-all duration-300"
                    style={{ width: `${originalPricePercentage}%` }}
                    title={`Tovar: ${originalPricePercentage.toFixed(0)}%`}
                  />
                  <div 
                    className="bg-gray-500 transition-all duration-300"
                    style={{ width: `${shippingPercentage}%` }}
                    title={`Pochta: ${shippingPercentage.toFixed(0)}%`}
                  />
                  <div 
                    className="bg-green-600 transition-all duration-300"
                    style={{ width: `${marginPercentage}%` }}
                    title={`Foyda: ${marginPercentage.toFixed(0)}%`}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Xarajat {(originalPricePercentage + shippingPercentage).toFixed(0)}%</span>
                <span className="font-medium text-green-600">Foyda {marginPercentage.toFixed(0)}%</span>
              </div>
            </div>
            
            {/* Exchange rates - Very subtle */}
            <div className="text-center text-xs text-gray-400 dark:text-gray-600 pt-2">
              <span>Valyuta kursi: 1 KRW = {exchangeRate.toFixed(1)} UZS</span>
            </div>
            
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}
