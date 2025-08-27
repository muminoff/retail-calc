import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

const DEFAULT_MARGIN = 20
const DEFAULT_SHIPPING_RATE = 15000 // KRW per 1kg

export function Calculator() {
  const [originalPrice, setOriginalPrice] = useState<number>(10000)
  const [weight, setWeight] = useState<number>(100)
  const [shippingRatePerKg, setShippingRatePerKg] = useState<number>(DEFAULT_SHIPPING_RATE)
  const [margin, setMargin] = useState<number>(DEFAULT_MARGIN)
  const [exchangeRate, setExchangeRate] = useState<number>(9.5) // Default KRW to UZS rate (will be updated from API)
  const [isPriceDetailsModalOpen, setIsPriceDetailsModalOpen] = useState(false)
  
  // Calculate shipping cost (weight in grams / 1000 to get kg * rate per kg)
  const shippingCost = (weight / 1000) * shippingRatePerKg
  
  // Calculate total cost in KRW
  const totalCostKRW = originalPrice + shippingCost
  
  // Calculate margin amount in KRW
  const marginAmountKRW = totalCostKRW * (margin / 100)
  
  // Calculate final price with margin in KRW
  const priceWithMarginKRW = totalCostKRW + marginAmountKRW
  
  // Convert to UZS and round to nearest thousand
  const retailPriceUZS = Math.round((priceWithMarginKRW * exchangeRate) / 1000) * 1000
  

  // Fetch exchange rate
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
      
      // Calculate KRW to UZS rate (1 KRW = ? UZS)
      const krwToUzs = usdToUzs / usdToKrw
      
      setExchangeRate(krwToUzs)
      
      // Log the fetched rate for debugging
      console.log('Exchange rate updated!')
      console.log(`1 KRW = ${krwToUzs.toFixed(4)} UZS`)
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
      // Keep the default rate on error
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

          {/* Divider */}
          <div className="border-t"></div>

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

          {/* Shipping Rate per KG */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="shipping-rate" className="text-lg font-medium">Pochta</Label>
              <span className="text-lg font-semibold text-primary">{formatNumber(shippingRatePerKg)} KRW</span>
            </div>
            <div className="py-2">
              <Slider
                id="shipping-rate"
                value={[shippingRatePerKg]}
                onValueChange={(value) => {
                  setShippingRatePerKg(value[0])
                  triggerHaptic()
                }}
                min={10000}
                max={50000}
                step={1000}
                className="touch-none"
              />
            </div>
          </div>

          {/* Margin */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-lg font-medium">Foyda</Label>
              <span className="text-lg font-semibold text-primary">{margin}%</span>
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
          <div className="space-y-3 p-4">
            {/* Cost breakdown */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Narxi:</span>
              <span className="font-semibold">{formatNumber(originalPrice)} KRW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pochta ({weight}g):</span>
              <span className="font-semibold">{formatNumber(shippingCost)} KRW</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Jami xarajat:</span>
              <span>{formatNumber(totalCostKRW)} KRW</span>
            </div>
            
            {/* Margin calculation */}
            <div className="flex justify-between pt-3 border-t">
              <span className="text-muted-foreground">Foyda ({margin}%):</span>
              <span className="font-semibold">{formatNumber(marginAmountKRW)} KRW</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Sotish narxi (KRW):</span>
              <span className="text-primary">{formatNumber(priceWithMarginKRW)} KRW</span>
            </div>
            
            {/* Exchange rate and final price */}
            <div className="flex justify-between text-sm pt-3 border-t">
              <span className="text-muted-foreground">Valyuta kursi:</span>
              <span>1 KRW = {exchangeRate.toFixed(2)} UZS</span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Yetib borishi:</span>
              <span className="text-primary">{formatNumber(retailPriceUZS)} UZS</span>
            </div>
            
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
