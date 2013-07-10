#lang racket/gui
(require racket/draw
         "gfx.rkt")
; test sync
(define b (make-bitmap 60 60))
(define g (new bitmap-dc% [bitmap b]))

(define (compare a b depth)
  (let* ([delta (map pixel- a b)]
         [sub-lens (for/list ([i (in-range 1 (add1 depth))])      
                     (* i i))]
         [accum-lens (for/list ([i (in-range 1 (add1 (length sub-lens)))]) 
                       (foldl + 0 (take sub-lens i)))])
    (for/list ([sub-len sub-lens]
               [accum-len (cons 0 accum-lens)])
      (take (drop delta accum-len) sub-len))))

(define (sum lst)
  (foldl + 0 lst))

(define (comparison-hash vx)
  (let* ([depth (length vx)]
         [div-depth (lambda (x) (/ x depth))])
    (sum (if (list? (car vx))
             (map comparison-hash vx)
             (map div-depth (map pixel->lum vx))))))


(let ([w (send b get-width)]
      [h (send b get-height)]
      [depth 3])
  (send* g
    (set-smoothing 'smoothed)
    (draw-line 0 0 w h)
    (draw-line w 0 0 h)
    (set-brush "white" 'transparent)
    (set-pen "blue" 2 'solid))
  (when (and (> w 10) (> h 10))
    (send g draw-rectangle 10 10 (- w 20) (- h 20)))
  (define hash-1 (hash-bitmap b depth))
  (send g draw-line 2 (/ h 2) w 5)
  (define hash-2 (hash-bitmap b depth))
  (send g draw-line (/ w 2) 0 (/ w 2) h)
  (define hash-3 (hash-bitmap b depth))
  (pretty-print (exact->inexact (comparison-hash (compare hash-1 hash-2 depth)))))
