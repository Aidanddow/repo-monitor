text = ' '.join([line for line in open("old_diss.txt").readlines()])
text = " ".join([w + "\n" if i%20==0 or "." in w else w for i,w in enumerate(text.split())])
print(text)

