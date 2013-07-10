#lang racket
(require racket/draw)
(provide pixel
         hash-bitmap
         pixel-
         pixel+
         pixel/
         pixel->lum)

;; get all of the pixels in a bitmap, directly
(define (bitmap->bytes bmp)
  (let* ([w (send bmp get-width)]
         [h (send bmp get-height)]
         [bpp (quotient (send bmp get-depth) 8)]
         [bts (make-bytes (* w h bpp))])
    (send bmp get-argb-pixels 0 0 w h bts)
    bts))

(struct pixel (a r g b) #:transparent)

(define map-pixel
  (case-lambda
    [(op px)
     (pixel (op (pixel-a px))
            (op (pixel-r px))
            (op (pixel-g px))
            (op (pixel-b px)))]
    [(op a b)
     (pixel (op (pixel-a a) (pixel-a b))
            (op (pixel-r a) (pixel-r b))
            (op (pixel-g a) (pixel-g b))
            (op (pixel-b a) (pixel-b b)))]))

(define ((pixel/ c) px)
  (map-pixel (lambda (a) (/ a c)) px))

(define (pixel+ a b)
  (map-pixel + a b))

(define (pixel- a b)
  (map-pixel - a b))

(define (pixel->lum px)
  (/ (* (/ (pixel-a px) 255)
        (+ (/ (* 10 (pixel-r px)) 30)
           (/ (* 12 (pixel-g px)) 30)
           (/ (* 8 (pixel-b px)) 30))) 255))

(define argb->lum
  (case-lambda ([bts-or-px
                 (if (bytes? bts-or-px)
                     (

(define (bytes->pixel bts)
  (pixel (bytes-ref bts 0)
         (bytes-ref bts 1)
         (bytes-ref bts 2)
         (bytes-ref bts 3)))

(define (pixel->bytes px)
  (bytes (pixel-a px)
         (pixel-r px)
         (pixel-g px)
         (pixel-b px)))

(define (hash-bitmap bmp n-depth)
  (let* ([data (bitmap->bytes bmp)]
         [length (bytes-length data)]
         [height (send bmp get-height)]
         [bpp (/ (send bmp get-depth) 8)]
         [width (send bmp get-width)]
         [stride (* width bpp)])
    (apply append
           (for/list ([i (in-range 1 (add1 n-depth))])
             (let ([w (/ width i)]
                   [h (/ height i)])
               (for*/list ([y (in-range 0 height h)]
                           [x (in-range 0 width w)])
                 (foldl pixel+ (pixel 0 0 0 0)
                        (map (pixel/ (* w h))
                             (for*/list ([dy (in-range y (+ y h))]
                                         [dx (in-range x (+ x w) bpp)])
                               (let* ([_dx (floor dx)]
                                      [_dy (floor dy)]
                                      [n (floor (+ (* _dy stride) (* _dx bpp)))])
                                 (pixel (bytes-ref data n)
                                        (bytes-ref data (+ n 1))
                                        (bytes-ref data (+ n 2))
                                        (bytes-ref data (+ n 3)))))))))))))
