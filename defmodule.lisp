;;;; defmodule.lisp

;(restas:define-policy datastore
;  (:interface-package #:synwork.policy.datastore)
;  (:interface-method-template "DATASTORE-~A")
;  (:internal-package #:synwork.datastore)
;
;  (define-method init ()
;	"initiate the datastore"))
;
(restas:define-module #:synwork
  (:use #:cl #:restas #:synwork-auth #:synwork-project)
  (:export #:start-synwork))
;
;(defpackage #:synwork.redis-datastore
;  (:use #:cl #:redis #:synwork.policy.datastore)
;  (:export #:redis-datastore))
;
(in-package #:synwork)

(defparameter *template-directory*
  (merge-pathnames #P"templates/" synwork-config:*base-directory*))

(defparameter *static-directory*
  (merge-pathnames #P"static/" synwork-config:*base-directory*))

(sexml:with-compiletime-active-layers
    (sexml:standard-sexml sexml:xml-doctype)
  (sexml:support-dtd
	(merge-pathnames "html5.dtd" (asdf:system-source-directory "sexml"))
	:<))

(mount-module -static- (#:restas.directory-publisher)
	(:url "static")
	(restas.directory-publisher:*directory* *static-directory*))	

(mount-module -authdemo- (#:synwork-auth)
  (:render-method 'html-frame)
  ;(synwork-auth:*authenticate-user-function* #'auth-user)
  ;(synwork-auth:*register-user-function* #'register-user)
  (synwork-auth:*redirect-route* 'home))

(mount-module -project- (#:synwork-project)
  (:render-method 'html-frame)
  (synwork-project:*redirect-route-project* 'home))

(mount-module -table- (#:synwork-table)
  (:render-method 'html-frame)
  (synwork-table:*redirect-route-table* 'home))


