(defpackage #:synwork-config (:export #:*base-directory*))
(defparameter synwork-config:*base-directory* 
  (make-pathname :name nil :type nil :defaults *load-truename*))

(asdf:defsystem #:synwork
  :serial t
  :description "Your description here"
  :author "Your name here"
  :license "Your license here"
  :depends-on (:RESTAS :SEXML :IRONCLAD :BABEL 
  			   :restas-directory-publisher :synwork-auth
			   :synwork-project :synwork-table)
  :components ((:file "defmodule")
  			   ;;;(:file "redis-datastore")
			   (:file "util")
			   (:file "template")
               (:file "synwork")))
