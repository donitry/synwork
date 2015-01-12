;;;;;;;;;; redis-datastore.lisp
;;;
(in-package #:synwork.redis-datastore)

(defclass redis-datastore ()
  ((host :initarg :host :initform #(127 0 0 1) :accessor host)
   (port :initarg :port :initform 6379 :accessor port)))

(defmethod datastore-init ((datastore redis-datastore)))


